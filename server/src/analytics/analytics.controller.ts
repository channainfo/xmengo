import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('user-engagement')
  @ApiOperation({ summary: 'Get user engagement metrics' })
  @ApiResponse({ status: 200, description: 'Returns user engagement metrics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'period', enum: ['day', 'week', 'month'], required: false })
  getUserEngagement(
    @Req() req,
    @Query('period') period: 'day' | 'week' | 'month' = 'week',
  ) {
    return this.analyticsService.getUserEngagementMetrics(req.user.id, period);
  }

  @Get('platform')
  @ApiOperation({ summary: 'Get platform-wide metrics (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns platform metrics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin access required' })
  @ApiQuery({ name: 'period', enum: ['day', 'week', 'month'], required: false })
  getPlatformMetrics(
    @Req() req,
    @Query('period') period: 'day' | 'week' | 'month' = 'month',
  ) {
    // In a real application, you would check if the user is an admin
    // For now, we'll assume the user with ID 1 is an admin
    const isAdmin = req.user.id === '1' || req.user.role === 'admin';
    return this.analyticsService.getPlatformMetrics(period, isAdmin);
  }
}
