import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('matches')
@Controller('matches')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('like/:userId')
  @ApiOperation({ summary: 'Like a user' })
  @ApiResponse({ status: 201, description: 'Like created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Already liked this user' })
  createLike(@Req() req, @Param('userId') toUserId: string) {
    return this.matchesService.createLike(req.user.id, toUserId);
  }

  @Get('likes')
  @ApiOperation({ summary: 'Get likes for current user' })
  @ApiResponse({ status: 200, description: 'Return likes' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getLikes(@Req() req, @Query('direction') direction: 'sent' | 'received' = 'received') {
    return this.matchesService.getLikes(req.user.id, direction);
  }

  @Get()
  @ApiOperation({ summary: 'Get all matches for current user' })
  @ApiResponse({ status: 200, description: 'Return matches' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMatches(@Req() req) {
    return this.matchesService.getMatches(req.user.id);
  }

  @Get(':matchId')
  @ApiOperation({ summary: 'Get a specific match by id' })
  @ApiResponse({ status: 200, description: 'Return the match' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  getMatch(@Req() req, @Param('matchId') matchId: string) {
    return this.matchesService.getMatch(req.user.id, matchId);
  }

  @Delete(':matchId')
  @ApiOperation({ summary: 'Unmatch with a user' })
  @ApiResponse({ status: 200, description: 'Unmatched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  unmatch(@Req() req, @Param('matchId') matchId: string) {
    return this.matchesService.unmatch(req.user.id, matchId);
  }
}
