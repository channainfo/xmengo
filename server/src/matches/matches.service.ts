import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MatchesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async createLike(fromUserId: string, toUserId: string) {
    // Check if users exist
    const fromUser = await this.prisma.user.findUnique({ where: { id: fromUserId } });
    const toUser = await this.prisma.user.findUnique({ where: { id: toUserId } });

    if (!fromUser || !toUser) {
      throw new NotFoundException('User not found');
    }

    // Check if already liked
    const existingLike = await this.prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId,
          toUserId,
        },
      },
    });

    if (existingLike) {
      throw new ConflictException('You have already liked this user');
    }

    // Check if the other user has already liked this user
    const mutualLike = await this.prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      },
    });

    // Create the like
    const like = await this.prisma.like.create({
      data: {
        fromUser: { connect: { id: fromUserId } },
        toUser: { connect: { id: toUserId } },
        isMatch: !!mutualLike,
      },
    });

    // If mutual like, create a match and update both likes
    if (mutualLike) {
      // Update the other like
      await this.prisma.like.update({
        where: {
          fromUserId_toUserId: {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        },
        data: { isMatch: true },
      });

      // Create a match
      const match = await this.prisma.match.create({
        data: {
          user: { connect: { id: fromUserId } },
          matchedUser: { connect: { id: toUserId } },
        },
        include: {
          user: true,
          matchedUser: true,
        },
      });
      
      // Create notifications for both users
      await this.notificationsService.createMatchNotification(
        fromUserId,
        match.id,
        match.matchedUser.name
      );
      
      await this.notificationsService.createMatchNotification(
        toUserId,
        match.id,
        match.user.name
      );

      return {
        like,
        isMatch: true,
        message: 'It\'s a match!',
      };
    }

    return {
      like,
      isMatch: false,
    };
  }

  async getLikes(userId: string, direction: 'sent' | 'received') {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (direction === 'sent') {
      return this.prisma.like.findMany({
        where: { fromUserId: userId },
        include: {
          toUser: {
            include: {
              photos: {
                where: { isMain: true },
              },
            },
          },
        },
      });
    } else {
      return this.prisma.like.findMany({
        where: { toUserId: userId },
        include: {
          fromUser: {
            include: {
              photos: {
                where: { isMain: true },
              },
            },
          },
        },
      });
    }
  }

  async getMatches(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.match.findMany({
      where: {
        OR: [
          { userId },
          { matchedId: userId },
        ],
      },
      include: {
        user: {
          include: {
            photos: {
              where: { isMain: true },
            },
          },
        },
        matchedUser: {
          include: {
            photos: {
              where: { isMain: true },
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
  }

  async getMatch(userId: string, matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        user: true,
        matchedUser: true,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // Ensure the user is part of this match
    if (match.userId !== userId && match.matchedId !== userId) {
      throw new NotFoundException('Match not found');
    }

    return match;
  }

  async unmatch(userId: string, matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // Ensure the user is part of this match
    if (match.userId !== userId && match.matchedId !== userId) {
      throw new NotFoundException('Match not found');
    }

    // Delete the match
    await this.prisma.match.delete({
      where: { id: matchId },
    });

    // Update the likes to no longer be matches
    await this.prisma.like.updateMany({
      where: {
        OR: [
          {
            fromUserId: match.userId,
            toUserId: match.matchedId,
          },
          {
            fromUserId: match.matchedId,
            toUserId: match.userId,
          },
        ],
      },
      data: {
        isMatch: false,
      },
    });

    return { message: 'Unmatched successfully' };
  }
}
