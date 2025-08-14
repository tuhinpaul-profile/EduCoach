import { randomInt } from "crypto";
import { db } from "./db";
import { users, otps } from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";
import type { InsertUser, InsertOtp, User } from "@shared/schema";

// Mock SMS service for development - replace with real SMS provider
class SMSService {
  async sendOTP(phone: string, otp: string): Promise<boolean> {
    console.log(`SMS Service: Sending OTP ${otp} to ${phone}`);
    // In production, integrate with providers like Twilio, AWS SNS, or local providers
    return true;
  }
}

export class AuthService {
  private smsService = new SMSService();

  // Generate 6-digit OTP
  private generateOTP(): string {
    return randomInt(100000, 999999).toString();
  }

  // Send OTP to phone number
  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Store OTP in database
      await db.insert(otps).values({
        phone,
        otp,
        expiresAt,
      });

      // Send SMS
      const smsSent = await this.smsService.sendOTP(phone, otp);
      
      if (smsSent) {
        return { success: true, message: "OTP sent successfully" };
      } else {
        return { success: false, message: "Failed to send OTP" };
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      return { success: false, message: "Failed to send OTP" };
    }
  }

  // Verify OTP and authenticate user
  async verifyOTP(phone: string, otpCode: string): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      // Find valid OTP
      const [validOtp] = await db
        .select()
        .from(otps)
        .where(
          and(
            eq(otps.phone, phone),
            eq(otps.otp, otpCode),
            eq(otps.isUsed, false),
            gt(otps.expiresAt, new Date())
          )
        )
        .limit(1);

      if (!validOtp) {
        return { success: false, message: "Invalid or expired OTP" };
      }

      // Mark OTP as used
      await db
        .update(otps)
        .set({ isUsed: true })
        .where(eq(otps.id, validOtp.id));

      // Find or create user
      let [user] = await db
        .select()
        .from(users)
        .where(eq(users.phone, phone))
        .limit(1);

      if (!user) {
        return { success: false, message: "User not found. Please contact administrator to create your account." };
      }

      // Update last login
      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));

      return { success: true, user, message: "Login successful" };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { success: false, message: "Verification failed" };
    }
  }

  // Register new user (admin only)
  async registerUser(userData: InsertUser): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.phone, userData.phone))
        .limit(1);

      if (existingUser) {
        return { success: false, message: "User with this phone number already exists" };
      }

      const [newUser] = await db
        .insert(users)
        .values(userData)
        .returning();

      return { success: true, user: newUser, message: "User registered successfully" };
    } catch (error) {
      console.error("Error registering user:", error);
      return { success: false, message: "Registration failed" };
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      
      return user || null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  }

  // Get users by role
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      return await db
        .select()
        .from(users)
        .where(and(eq(users.role, role), eq(users.isActive, true)));
    } catch (error) {
      console.error("Error getting users by role:", error);
      return [];
    }
  }
}

export const authService = new AuthService();