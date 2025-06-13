import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { WebsocketsGateway } from '../websockets/websockets.gateway';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private websocketsGateway: WebsocketsGateway,
  ) {}

  async sendMessage(senderId: string, matchId: string, content: string) {
    // Check if match exists and user is part of it
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // Ensure the sender is part of this match
    if (match.userId !== senderId && match.matchedId !== senderId) {
      throw new ForbiddenException('You are not part of this match');
    }

    // Determine recipient ID
    const recipientId = match.userId === senderId ? match.matchedId : match.userId;
    
    // Create the message
    const message = await this.prisma.message.create({
      data: {
        content,
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: recipientId } },
        match: { connect: { id: matchId } },
        read: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            photos: {
              where: { isMain: true },
              select: { url: true },
            },
          },
        },
      },
    });
    
    // Create notification for the recipient
    await this.notificationsService.createMessageNotification(
      recipientId,
      message.id,
      message.sender.name,
      content
    );
    
    // Send real-time message via WebSockets
    this.websocketsGateway.sendMessageToMatch(matchId, {
      id: message.id,
      content,
      senderId: senderId,
      matchId: matchId,
      sender: message.sender,
      createdAt: message.createdAt,
    });

    return message;
  }

  async getMessages(userId: string, matchId: string) {
    // Check if match exists and user is part of it
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // Ensure the user is part of this match
    if (match.userId !== userId && match.matchedId !== userId) {
      throw new ForbiddenException('You are not part of this match');
    }

    // Get messages for this match
    const messages = await this.prisma.message.findMany({
      where: { matchId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            photos: {
              where: { isMain: true },
              select: { url: true },
            },
          },
        },
      },
    });

    // Mark all unread messages as read
    await this.prisma.message.updateMany({
      where: {
        matchId,
        receiverId: userId,
        read: false,
      },
      data: { read: true },
    });

    return messages;
  }

  async getUnreadMessagesCount(userId: string) {
    return this.prisma.message.count({
      where: {
        receiverId: userId,
        read: false,
      },
    });
  }

  async deleteMessage(userId: string, messageId: string) {
    // Check if message exists and belongs to the user
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Ensure the user is the sender of this message
    if (message.senderId !== userId) {
      throw new ForbiddenException('You cannot delete this message');
    }

    // Delete the message
    await this.prisma.message.delete({
      where: { id: messageId },
    });

    return { message: 'Message deleted successfully' };
  }

  async getConversations(userId: string) {
    // Get all matches for the user
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [
          { userId },
          { matchedId: userId },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            photos: {
              where: { isMain: true },
              select: { url: true },
            },
          },
        },
        matchedUser: {
          select: {
            id: true,
            name: true,
            photos: {
              where: { isMain: true },
              select: { url: true },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    // For each match, get the unread count
    const conversationsWithUnreadCount = await Promise.all(
      matches.map(async (match) => {
        const unreadCount = await this.prisma.message.count({
          where: {
            matchId: match.id,
            receiverId: userId,
            read: false,
          },
        });

        // Determine the other user in the conversation
        const otherUser = match.userId === userId ? match.matchedUser : match.user;

        return {
          matchId: match.id,
          otherUser,
          lastMessage: match.messages[0] || null,
          unreadCount,
        };
      }),
    );

    // Sort by most recent message
    return conversationsWithUnreadCount.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
    });
  }
}
