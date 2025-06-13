import { Controller, Get, Post, Body, Delete, UseGuards, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@ApiTags('subscriptions')
@Controller('subscriptions')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription plans' })
  @ApiResponse({ status: 200, description: 'Return subscription plans' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getSubscriptionPlans() {
    return this.subscriptionsService.getSubscriptionPlans();
  }

  @Get('my-subscription')
  @ApiOperation({ summary: 'Get current user subscription' })
  @ApiResponse({ status: 200, description: 'Return user subscription' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserSubscription(@Req() req) {
    return this.subscriptionsService.getUserSubscription(req.user.id);
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to a plan' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  createSubscription(
    @Req() req,
    @Body() subscriptionData: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.createSubscription(
      req.user.id,
      subscriptionData.planId,
      subscriptionData.paymentMethodId,
    );
  }

  @Delete('cancel')
  @ApiOperation({ summary: 'Cancel current subscription' })
  @ApiResponse({ status: 200, description: 'Subscription canceled successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'No active subscription' })
  @ApiResponse({ status: 404, description: 'User not found' })
  cancelSubscription(@Req() req) {
    return this.subscriptionsService.cancelSubscription(req.user.id);
  }

  @Get('status')
  @ApiOperation({ summary: 'Check subscription status and features' })
  @ApiResponse({ status: 200, description: 'Return subscription status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  checkSubscriptionStatus(@Req() req) {
    return this.subscriptionsService.checkSubscriptionStatus(req.user.id);
  }
}
