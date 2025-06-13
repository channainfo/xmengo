import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto, NotificationType } from './dto/create-notification.dto';
import { WebsocketsGateway } from '../websockets/websockets.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private websocketsGateway: WebsocketsGateway,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const { userId, type, title, message, entityId, data } = createNotificationDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create notification
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        entityId,
        data,
        isRead: false,
      },
    });

    // Send real-time notification via WebSockets
    this.websocketsGateway.sendNotificationToUser(userId, {
      id: notification.id,
      type,
      title,
      message,
      entityId,
      data,
      createdAt: notification.createdAt,
    });

    return notification;
  }

  async getUserNotifications(userId: string, page: number = 1, limit: number = 10) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Get notifications
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await this.prisma.notification.count({
      where: { userId },
    });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    // Check if notification exists and belongs to user
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }

    // Update notification
    const updatedNotification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return updatedNotification;
  }

  async markAllAsRead(userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Update all unread notifications
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(userId: string, notificationId: string) {
    // Check if notification exists and belongs to user
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }

    // Delete notification
    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: 'Notification deleted successfully' };
  }

  async getUnreadCount(userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Count unread notifications
    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { count };
  }

  // Helper methods for creating specific types of notifications
  async createMatchNotification(userId: string, matchId: string, matchedUserName: string) {
    return this.createNotification({
      userId,
      type: NotificationType.MATCH,
      title: 'New Match!',
      message: `You have a new match with ${matchedUserName}!`,
      entityId: matchId,
      data: JSON.stringify({ matchedUserName }),
    });
  }

  async createMessageNotification(userId: string, messageId: string, senderName: string, messagePreview: string) {
    return this.createNotification({
      userId,
      type: NotificationType.MESSAGE,
      title: 'New Message',
      message: `${senderName}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}`,
      entityId: messageId,
      data: JSON.stringify({ senderName, messagePreview }),
    });
  }

  async createLikeNotification(userId: string, likeId: string, likerName: string) {
    return this.createNotification({
      userId,
      type: NotificationType.LIKE,
      title: 'New Like',
      message: `${likerName} liked your profile!`,
      entityId: likeId,
      data: JSON.stringify({ likerName }),
    });
  }

  async createSubscriptionNotification(userId: string, subscriptionId: string, planName: string) {
    return this.createNotification({
      userId,
      type: NotificationType.SUBSCRIPTION,
      title: 'Subscription Activated',
      message: `Your ${planName} subscription has been activated!`,
      entityId: subscriptionId,
      data: JSON.stringify({ planName }),
    });
  }

  async createPaymentNotification(userId: string, paymentId: string, amount: number, currency: string) {
    return this.createNotification({
      userId,
      type: NotificationType.PAYMENT,
      title: 'Payment Processed',
      message: `Your payment of ${amount} ${currency} has been processed successfully.`,
      entityId: paymentId,
      data: JSON.stringify({ amount, currency }),
    });
  }

  async createSystemNotification(userId: string, title: string, message: string) {
    return this.createNotification({
      userId,
      type: NotificationType.SYSTEM,
      title,
      message,
    });
  }
}
