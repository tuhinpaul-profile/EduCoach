import { db } from "./db";
import { notifications, broadcastRecipients, users } from "@shared/schema";
import { eq, and, desc, or } from "drizzle-orm";
import type { InsertNotification, Notification, User } from "@shared/schema";

export class NotificationService {
  // Send a direct message to a specific user
  async sendMessage(fromUserId: string, toUserId: string, title: string, content: string): Promise<{ success: boolean; message: string }> {
    try {
      const [notification] = await db
        .insert(notifications)
        .values({
          fromUserId,
          toUserId,
          title,
          content,
          type: "message",
        })
        .returning();

      return { success: true, message: "Message sent successfully" };
    } catch (error) {
      console.error("Error sending message:", error);
      return { success: false, message: "Failed to send message" };
    }
  }

  // Send broadcast message to multiple users
  async sendBroadcast(fromUserId: string, recipientIds: string[], title: string, content: string): Promise<{ success: boolean; message: string }> {
    try {
      // Create the broadcast notification
      const [notification] = await db
        .insert(notifications)
        .values({
          fromUserId,
          toUserId: null, // null indicates broadcast
          title,
          content,
          type: "broadcast",
        })
        .returning();

      // Create recipient records
      const recipientRecords = recipientIds.map(recipientId => ({
        notificationId: notification.id,
        recipientId,
      }));

      await db.insert(broadcastRecipients).values(recipientRecords);

      return { success: true, message: `Broadcast sent to ${recipientIds.length} recipients` };
    } catch (error) {
      console.error("Error sending broadcast:", error);
      return { success: false, message: "Failed to send broadcast" };
    }
  }

  // Get inbox messages for a user
  async getInbox(userId: string): Promise<any[]> {
    try {
      // Get direct messages with sender info
      const directMessages = await db
        .select({
          id: notifications.id,
          fromUserId: notifications.fromUserId,
          toUserId: notifications.toUserId,
          title: notifications.title,
          content: notifications.content,
          type: notifications.type,
          isRead: notifications.isRead,
          createdAt: notifications.createdAt,
          fromUser: {
            name: users.name,
            role: users.role,
          }
        })
        .from(notifications)
        .leftJoin(users, eq(notifications.fromUserId, users.id))
        .where(eq(notifications.toUserId, userId))
        .orderBy(desc(notifications.createdAt));

      // Get broadcast messages with sender info
      const broadcastMessages = await db
        .select({
          id: notifications.id,
          fromUserId: notifications.fromUserId,
          toUserId: notifications.toUserId,
          title: notifications.title,
          content: notifications.content,
          type: notifications.type,
          isRead: broadcastRecipients.isRead,
          createdAt: notifications.createdAt,
          fromUser: {
            name: users.name,
            role: users.role,
          }
        })
        .from(notifications)
        .leftJoin(users, eq(notifications.fromUserId, users.id))
        .innerJoin(broadcastRecipients, eq(notifications.id, broadcastRecipients.notificationId))
        .where(eq(broadcastRecipients.recipientId, userId))
        .orderBy(desc(notifications.createdAt));

      // Combine and sort by creation date
      const allMessages = [...directMessages, ...broadcastMessages]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return allMessages;
    } catch (error) {
      console.error("Error getting inbox:", error);
      return [];
    }
  }

  // Get sent messages for a user
  async getSentMessages(userId: string): Promise<any[]> {
    try {
      const sentMessages = await db
        .select({
          id: notifications.id,
          fromUserId: notifications.fromUserId,
          toUserId: notifications.toUserId,
          title: notifications.title,
          content: notifications.content,
          type: notifications.type,
          isRead: notifications.isRead,
          createdAt: notifications.createdAt,
        })
        .from(notifications)
        .where(eq(notifications.fromUserId, userId))
        .orderBy(desc(notifications.createdAt));

      // Add recipient count and read count for each message
      const messagesWithStats = await Promise.all(
        sentMessages.map(async (message) => {
          if (message.type === 'broadcast') {
            const recipients = await db
              .select()
              .from(broadcastRecipients)
              .where(eq(broadcastRecipients.notificationId, message.id));
            
            const readCount = recipients.filter(r => r.isRead).length;
            
            return {
              ...message,
              recipientCount: recipients.length,
              readCount: readCount,
            };
          } else {
            return {
              ...message,
              recipientCount: 1,
              readCount: message.isRead ? 1 : 0,
            };
          }
        })
      );

      return messagesWithStats;
    } catch (error) {
      console.error("Error getting sent messages:", error);
      return [];
    }
  }

  // Mark message as read
  async markAsRead(notificationId: string, userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if it's a direct message
      const [notification] = await db
        .select()
        .from(notifications)
        .where(and(eq(notifications.id, notificationId), eq(notifications.toUserId, userId)))
        .limit(1);

      if (notification) {
        await db
          .update(notifications)
          .set({ isRead: true })
          .where(eq(notifications.id, notificationId));
      } else {
        // Check if it's a broadcast message
        await db
          .update(broadcastRecipients)
          .set({ isRead: true, readAt: new Date() })
          .where(and(
            eq(broadcastRecipients.notificationId, notificationId),
            eq(broadcastRecipients.recipientId, userId)
          ));
      }

      return { success: true, message: "Message marked as read" };
    } catch (error) {
      console.error("Error marking message as read:", error);
      return { success: false, message: "Failed to mark message as read" };
    }
  }

  // Get unread count for a user
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const directCount = await db
        .select({ count: notifications.id })
        .from(notifications)
        .where(and(eq(notifications.toUserId, userId), eq(notifications.isRead, false)));

      const broadcastCount = await db
        .select({ count: broadcastRecipients.id })
        .from(broadcastRecipients)
        .where(and(eq(broadcastRecipients.recipientId, userId), eq(broadcastRecipients.isRead, false)));

      return directCount.length + broadcastCount.length;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  // Get users by roles for broadcast selection
  async getUsersByRoles(roles: string[]): Promise<User[]> {
    try {
      if (roles.length === 0) return [];
      
      const roleConditions = roles.map(role => eq(users.role, role));
      const condition = roles.length === 1 
        ? and(eq(users.isActive, true), roleConditions[0])
        : and(eq(users.isActive, true), or(...roleConditions));
        
      return await db
        .select()
        .from(users)
        .where(condition);
    } catch (error) {
      console.error("Error getting users by roles:", error);
      return [];
    }
  }
}

export const notificationService = new NotificationService();