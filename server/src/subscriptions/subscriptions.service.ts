import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getSubscriptionPlans() {
    // In a real app, these would likely be stored in the database
    return [
      {
        id: 'basic',
        name: 'Basic',
        price: 0,
        currency: 'USD',
        features: [
          'Limited swipes per day',
          'Basic matching algorithm',
          'No ads',
        ],
        duration: 30, // days
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 9.99,
        currency: 'USD',
        features: [
          'Unlimited swipes',
          'See who likes you',
          'Advanced matching algorithm',
          'No ads',
          'Boost your profile once a month',
        ],
        duration: 30, // days
      },
      {
        id: 'platinum',
        name: 'Platinum',
        price: 19.99,
        currency: 'USD',
        features: [
          'All Premium features',
          'Priority in matching queue',
          'Unlimited boosts',
          'Message before matching',
          'See read receipts',
        ],
        duration: 30, // days
      },
    ];
  }

  async getUserSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.subscription) {
      return {
        currentPlan: 'basic',
        isActive: true,
        expiresAt: null,
      };
    }

    return user.subscription;
  }

  async createSubscription(userId: string, planId: string, paymentMethodId: string) {
    // Validate user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get subscription plans
    const plans = await this.getSubscriptionPlans();
    const selectedPlan = plans.find(plan => plan.id === planId);

    if (!selectedPlan) {
      throw new BadRequestException('Invalid subscription plan');
    }

    // In a real app, we would process payment here using a payment gateway
    // For now, we'll simulate a successful payment

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + selectedPlan.duration);

    // Create or update subscription
    if (user.subscription) {
      // Update existing subscription
      return this.prisma.subscription.update({
        where: { userId },
        data: {
          tier: planId,
          amount: selectedPlan.price,
          currency: selectedPlan.currency,
          isActive: true,
          startDate: new Date(),
          endDate: expiresAt,
          paymentMethod: paymentMethodId,
        },
      });
    } else {
      // Create new subscription
      return this.prisma.subscription.create({
        data: {
          user: { connect: { id: userId } },
          tier: planId,
          amount: selectedPlan.price,
          currency: selectedPlan.currency,
          isActive: true,
          startDate: new Date(),
          endDate: expiresAt,
          paymentMethod: paymentMethodId,
          transactionId: `sim_${Date.now()}`, // Simulated transaction ID
        },
      });
    }
  }

  async cancelSubscription(userId: string) {
    // Validate user and subscription
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.subscription) {
      throw new BadRequestException('No active subscription to cancel');
    }

    // In a real app, we would cancel the subscription with the payment gateway
    // For now, we'll just mark it as inactive but let it run until expiration

    return this.prisma.subscription.update({
      where: { userId },
      data: {
        isActive: false,
        // We can't use canceledAt as it doesn't exist in the schema
        // Instead, we'll update the endDate to now
        endDate: new Date(),
      },
    });
  }

  async checkSubscriptionStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.subscription) {
      return {
        isSubscribed: false,
        plan: 'basic',
        features: {
          unlimitedSwipes: false,
          seeWhoLikesYou: false,
          advancedMatching: false,
          priorityQueue: false,
          messageBeforeMatch: false,
          readReceipts: false,
          boosts: 0,
        },
      };
    }

    // Check if subscription is expired
    const now = new Date();
    const isExpired = user.subscription.endDate < now;

    if (isExpired || !user.subscription.isActive) {
      // If expired, update subscription status
      await this.prisma.subscription.update({
        where: { userId },
        data: { isActive: false },
      });

      return {
        isSubscribed: false,
        plan: 'basic',
        features: {
          unlimitedSwipes: false,
          seeWhoLikesYou: false,
          advancedMatching: false,
          priorityQueue: false,
          messageBeforeMatch: false,
          readReceipts: false,
          boosts: 0,
        },
      };
    }

    // Return features based on tier
    const features = {
      unlimitedSwipes: user.subscription.tier !== 'basic',
      seeWhoLikesYou: user.subscription.tier !== 'basic',
      advancedMatching: user.subscription.tier !== 'basic',
      priorityQueue: user.subscription.tier === 'platinum',
      messageBeforeMatch: user.subscription.tier === 'platinum',
      readReceipts: user.subscription.tier === 'platinum',
      boosts: user.subscription.tier === 'premium' ? 1 : user.subscription.tier === 'platinum' ? 999 : 0,
    };

    return {
      isSubscribed: true,
      plan: user.subscription.tier,
      expiresAt: user.subscription.endDate,
      features,
    };
  }
}
