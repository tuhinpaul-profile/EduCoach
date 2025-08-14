import type { Express } from "express";
import { authService } from "./auth-service";
import { notificationService } from "./notification-service";
import { loginSchema, verifyOtpSchema, sendNotificationSchema } from "@shared/schema";
import { z } from "zod";

// Session type declaration
declare module "express-session" {
  interface SessionData {
    userId?: string;
    userRole?: string;
  }
}

export function setupAuthRoutes(app: Express) {
  // Send OTP to phone number
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { phone, role } = loginSchema.parse(req.body);
      
      const result = await authService.sendOTP(phone);
      
      if (result.success) {
        res.status(200).json({ message: result.message });
      } else {
        res.status(400).json({ error: result.message });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors });
      } else {
        console.error("Send OTP error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Verify OTP and login
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phone, otp } = verifyOtpSchema.parse(req.body);
      
      const result = await authService.verifyOTP(phone, otp);
      
      if (result.success && result.user) {
        req.session.userId = result.user.id;
        req.session.userRole = result.user.role;
        res.status(200).json({ 
          message: result.message, 
          user: result.user 
        });
      } else {
        res.status(400).json({ error: result.message });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors });
      } else {
        console.error("Verify OTP error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get current user
  app.get("/api/auth/user", async (req, res) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await authService.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Register new user (admin/coordinator only)
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Check if user is admin or coordinator
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const currentUser = await authService.getUserById(userId);
      if (!currentUser || !["admin", "coordinator"].includes(currentUser.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      const userData = req.body;
      const result = await authService.registerUser(userData);
      
      if (result.success) {
        res.status(201).json({ 
          message: result.message, 
          user: result.user 
        });
      } else {
        res.status(400).json({ error: result.message });
      }
    } catch (error) {
      console.error("Register user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get users by role (admin/coordinator only)
  app.get("/api/auth/users/:role", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const currentUser = await authService.getUserById(userId);
      if (!currentUser || !["admin", "coordinator"].includes(currentUser.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      const { role } = req.params;
      const users = await authService.getUsersByRole(role);
      
      res.status(200).json(users);
    } catch (error) {
      console.error("Get users by role error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Send notification/message
  app.post("/api/notifications/send", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const currentUser = await authService.getUserById(userId);
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const { toUserId, title, content, type, recipients } = sendNotificationSchema.parse(req.body);
      
      let result;
      
      if (type === "broadcast" && recipients && recipients.length > 0) {
        // Check permissions for broadcast
        if (!["admin", "coordinator", "teacher"].includes(currentUser.role)) {
          return res.status(403).json({ error: "Insufficient permissions for broadcast" });
        }
        result = await notificationService.sendBroadcast(userId, recipients, title, content);
      } else if (toUserId) {
        result = await notificationService.sendMessage(userId, toUserId, title, content);
      } else {
        return res.status(400).json({ error: "Either toUserId or recipients required" });
      }
      
      if (result.success) {
        res.status(200).json({ message: result.message });
      } else {
        res.status(400).json({ error: result.message });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors });
      } else {
        console.error("Send notification error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get inbox
  app.get("/api/notifications/inbox", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const messages = await notificationService.getInbox(userId);
      res.status(200).json(messages);
    } catch (error) {
      console.error("Get inbox error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get sent messages
  app.get("/api/notifications/sent", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const messages = await notificationService.getSentMessages(userId);
      res.status(200).json(messages);
    } catch (error) {
      console.error("Get sent messages error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mark message as read
  app.put("/api/notifications/:id/read", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { id } = req.params;
      const result = await notificationService.markAsRead(id, userId);
      
      if (result.success) {
        res.status(200).json({ message: result.message });
      } else {
        res.status(400).json({ error: result.message });
      }
    } catch (error) {
      console.error("Mark as read error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get unread count
  app.get("/api/notifications/unread-count", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const count = await notificationService.getUnreadCount(userId);
      res.status(200).json({ count });
    } catch (error) {
      console.error("Get unread count error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

