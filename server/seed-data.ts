import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedSampleUsers() {
  try {
    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.phone, "+919876543210"))
      .limit(1);

    if (existingAdmin.length === 0) {
      // Create sample users for testing
      const sampleUsers = [
        {
          name: "System Administrator",
          phone: "+919876543210",
          email: "admin@edumanage.com",
          role: "admin",
          isActive: true
        },
        {
          name: "Academic Coordinator", 
          phone: "+919876543211",
          email: "coordinator@edumanage.com",
          role: "coordinator",
          isActive: true
        },
        {
          name: "Physics Teacher",
          phone: "+919876543212",
          email: "physics@edumanage.com", 
          role: "teacher",
          isActive: true
        },
        {
          name: "Student John Doe",
          phone: "+919876543213",
          email: "john@student.com",
          role: "student", 
          isActive: true
        },
        {
          name: "Parent Jane Doe",
          phone: "+919876543214",
          email: "jane@parent.com",
          role: "parent",
          isActive: true
        }
      ];

      await db.insert(users).values(sampleUsers);
      console.log("Sample users created successfully");
    } else {
      console.log("Sample users already exist, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding sample users:", error);
  }
}