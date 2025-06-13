import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FilterProfilesDto } from './dto/filter-profiles.dto';
import { UserStatusService } from '../users/user-status.service';
import { AddPhotoDto } from './dto/add-photo.dto';

@ApiTags('profiles')
@Controller('profiles')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly userStatusService: UserStatusService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return the user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyProfile(@Req() req) {
    return this.profilesService.getProfile(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user profile by id' })
  @ApiResponse({ status: 200, description: 'Return the user profile' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Param('id') id: string) {
    const profile = await this.profilesService.getProfile(id);
    const isOnline = this.userStatusService.isUserOnline(id);
    
    return {
      ...profile,
      isOnline,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all profiles' })
  @ApiResponse({ status: 200, description: 'Return all profiles' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req) {
    const profiles = await this.profilesService.findAll();
    const userIds = profiles.map(profile => profile.id);
    const onlineStatus = this.userStatusService.getOnlineStatus(userIds);
    
    return profiles.map(profile => ({
      ...profile,
      isOnline: onlineStatus[profile.id] || false,
    }));
  }

  @Patch()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post('photos')
  @ApiOperation({ summary: 'Add a photo to current user profile' })
  @ApiResponse({ status: 201, description: 'Photo successfully added' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  addPhoto(@Req() req, @Body() photoData: AddPhotoDto) {
    return this.profilesService.addPhoto(req.user.id, photoData.url, photoData.isMain);
  }

  @Delete('photos/:photoId')
  @ApiOperation({ summary: 'Delete a photo from current user profile' })
  @ApiResponse({ status: 200, description: 'Photo successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  deletePhoto(@Req() req, @Param('photoId') photoId: string) {
    return this.profilesService.deletePhoto(req.user.id, photoId);
  }

  @Post('photos/:photoId/main')
  @ApiOperation({ summary: 'Set a photo as main profile photo' })
  @ApiResponse({ status: 200, description: 'Main photo successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  setMainPhoto(@Req() req, @Param('photoId') photoId: string) {
    return this.profilesService.setMainPhoto(req.user.id, photoId);
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get profile recommendations' })
  @ApiResponse({ status: 200, description: 'Returns profile recommendations' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getRecommendations(
    @Req() req, 
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    return this.profilesService.getRecommendations(req.user.id, limit, page);
  }
  
  @Get('discover')
  @ApiOperation({ summary: 'Discover profiles with advanced filtering' })
  @ApiResponse({ status: 200, description: 'Returns filtered profiles' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  discoverProfiles(
    @Req() req,
    @Query() filterDto: FilterProfilesDto,
  ) {
    return this.profilesService.filterProfiles(req.user.id, filterDto);
  }
}
