import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketsGateway } from '../websockets/websockets.gateway';

@Injectable()
export class UserStatusService {
  private readonly logger = new Logger(UserStatusService.name);
  private onlineUsers: Map<string, Date> = new Map(); // userId -> lastActiveTime
  private readonly INACTIVE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => WebsocketsGateway))
    private websocketsGateway: WebsocketsGateway,
  ) {
    // Start periodic cleanup of inactive users
    setInterval(() => this.cleanupInactiveUsers(), 60 * 1000); // Run every minute
  }

  /**
   * Mark a user as online
   */
  async userConnected(userId: string): Promise<void> {
    const now = new Date();
    const wasOffline = !this.onlineUsers.has(userId);
    
    this.onlineUsers.set(userId, now);
    
    // Update last active timestamp in database
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastActive: now },
    });
    
    // Broadcast status change if user just came online
    if (wasOffline) {
      this.websocketsGateway.broadcastUserStatus(userId, true);
      this.logger.log(`User ${userId} is now online`);
    }
  }

  /**
   * Mark a user as offline
   */
  async userDisconnected(userId: string): Promise<void> {
    if (this.onlineUsers.has(userId)) {
      this.onlineUsers.delete(userId);
      
      // Update last active timestamp in database
      const now = new Date();
      await this.prisma.user.update({
        where: { id: userId },
        data: { lastActive: now },
      });
      
      // Broadcast status change
      this.websocketsGateway.broadcastUserStatus(userId, false);
      this.logger.log(`User ${userId} is now offline`);
    }
  }

  /**
   * Update user's last active time
   */
  async updateUserActivity(userId: string): Promise<void> {
    const now = new Date();
    
    // Only update if user is already online
    if (this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, now);
    } else {
      // If not in our online map, add them and broadcast
      await this.userConnected(userId);
    }
  }

  /**
   * Check if a user is online
   */
  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  /**
   * Get all online users
   */
  getOnlineUsers(): string[] {
    return Array.from(this.onlineUsers.keys());
  }

  /**
   * Get online status for multiple users
   */
  getOnlineStatus(userIds: string[]): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    
    for (const userId of userIds) {
      result[userId] = this.isUserOnline(userId);
    }
    
    return result;
  }

  /**
   * Clean up inactive users
   */
  private async cleanupInactiveUsers(): Promise<void> {
    const now = new Date();
    const inactiveThreshold = new Date(now.getTime() - this.INACTIVE_THRESHOLD_MS);
    
    for (const [userId, lastActive] of this.onlineUsers.entries()) {
      if (lastActive < inactiveThreshold) {
        await this.userDisconnected(userId);
        this.logger.log(`User ${userId} marked as offline due to inactivity`);
      }
    }
  }
}
