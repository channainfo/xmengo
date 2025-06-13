import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getUserEngagementMetrics(userId: string, period: 'day' | 'week' | 'month' = 'week') {
    // Calculate date range based on period
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    // Get likes sent
    const likesSent = await this.prisma.like.count({
      where: {
        fromUserId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get likes received
    const likesReceived = await this.prisma.like.count({
      where: {
        toUserId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get matches created
    const matchesCreated = await this.prisma.match.count({
      where: {
        OR: [
          { userId: userId },
          { matchedId: userId },
        ],
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get messages sent
    const messagesSent = await this.prisma.message.count({
      where: {
        senderId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get messages received
    const messagesReceived = await this.prisma.message.count({
      where: {
        receiverId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get profile views (this would require a separate table to track views)
    // For now, we'll return a placeholder
    const profileViews = 0;

    return {
      period,
      timeRange: {
        start: startDate,
        end: endDate,
      },
      metrics: {
        likesSent,
        likesReceived,
        matchesCreated,
        messagesSent,
        messagesReceived,
        profileViews,
        engagementScore: this.calculateEngagementScore({
          likesSent,
          likesReceived,
          matchesCreated,
          messagesSent,
          messagesReceived,
          profileViews,
        }),
      },
    };
  }

  async getPlatformMetrics(period: 'day' | 'week' | 'month' = 'month', isAdmin: boolean = false) {
    if (!isAdmin) {
      return { error: 'Unauthorized access to platform metrics' };
    }

    // Calculate date range based on period
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    // Get new users
    const newUsers = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get total users
    const totalUsers = await this.prisma.user.count();

    // Get active users (users who have sent a like or message)
    const activeUsers = await this.prisma.user.count({
      where: {
        OR: [
          {
            sentLikes: {
              some: {
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
          },
          {
            sentMessages: {
              some: {
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
          },
        ],
      },
    });

    // Get total matches
    const totalMatches = await this.prisma.match.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get total messages
    const totalMessages = await this.prisma.message.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get subscription metrics
    const subscriptions = await this.prisma.subscription.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get subscription revenue (simplified)
    const subscriptionRevenue = await this.prisma.subscription.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return {
      period,
      timeRange: {
        start: startDate,
        end: endDate,
      },
      metrics: {
        newUsers,
        totalUsers,
        activeUsers,
        dailyActiveUsers: Math.round(activeUsers / 30), // Simplified calculation
        totalMatches,
        totalMessages,
        subscriptions,
        revenue: subscriptionRevenue._sum.amount || 0,
        retentionRate: this.calculateRetentionRate(newUsers, activeUsers),
      },
    };
  }

  private calculateEngagementScore(metrics: any): number {
    // Simple engagement score calculation
    // This could be made more sophisticated based on business requirements
    const {
      likesSent,
      likesReceived,
      matchesCreated,
      messagesSent,
      messagesReceived,
      profileViews,
    } = metrics;

    // Weights for different actions
    const weights = {
      likesSent: 1,
      likesReceived: 1.5,
      matchesCreated: 3,
      messagesSent: 2,
      messagesReceived: 1.5,
      profileViews: 0.5,
    };

    // Calculate weighted sum
    const score =
      likesSent * weights.likesSent +
      likesReceived * weights.likesReceived +
      matchesCreated * weights.matchesCreated +
      messagesSent * weights.messagesSent +
      messagesReceived * weights.messagesReceived +
      profileViews * weights.profileViews;

    return Math.round(score);
  }

  private calculateRetentionRate(newUsers: number, activeUsers: number): number {
    // Simplified retention rate calculation
    // In a real app, this would be more complex and based on cohort analysis
    if (newUsers === 0) return 0;
    const rate = (activeUsers / newUsers) * 100;
    return Math.min(100, Math.round(rate)); // Cap at 100%
  }
}
