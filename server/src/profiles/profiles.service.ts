import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterProfilesDto, SortBy } from './dto/filter-profiles.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        photos: {
          where: { isMain: true },
          take: 1,
        },
        interests: true,
      },
      where: {
        profileCompleted: true,
      },
    });

    return users.map(user => ({
      id: user.id,
      name: user.name,
      bio: user.bio,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      photos: user.photos,
      interests: user.interests,
      lastActive: user.lastActive,
    }));
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        photos: true,
        interests: true,
        subscription: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Calculate profile completion percentage
    const requiredFields = ['name', 'bio', 'dateOfBirth', 'gender', 'interestedIn'];
    const completedFields = requiredFields.filter(field => !!user[field]);
    const hasPhotos = user.photos.length > 0;
    const hasInterests = user.interests.length > 0;
    
    const totalFields = requiredFields.length + 2; // +2 for photos and interests
    const completedCount = completedFields.length + (hasPhotos ? 1 : 0) + (hasInterests ? 1 : 0);
    const completionPercentage = Math.round((completedCount / totalFields) * 100);

    // Update profile completion status if needed
    if (user.profileCompleted !== (completionPercentage === 100)) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { profileCompleted: completionPercentage === 100 },
      });
    }

    return {
      ...user,
      completionPercentage,
    };
  }

  async updateProfile(userId: string, updateData: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Handle interests separately if provided
    let interests;
    if (updateData.interests) {
      interests = updateData.interests;
      delete updateData.interests;
    }

    // Update user basic info without interests
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        // Exclude interests as they need special handling
        interests: undefined
      },
      include: {
        photos: true,
        interests: true,
      },
    });

    // Update interests if provided
    if (interests && interests.length > 0) {
      // Clear existing interests
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          interests: {
            set: [],
          },
        },
      });

      // Add new interests, creating them if they don't exist
      for (const interestName of interests) {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            interests: {
              connectOrCreate: {
                where: {
                  name: interestName,
                },
                create: {
                  name: interestName,
                },
              },
            },
          },
        });
      }
    }

    return this.getProfile(userId);
  }

  async addPhoto(userId: string, photoUrl: string, isMain: boolean = false) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        photos: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // If this is the first photo or set as main, unset other main photos
    if (isMain || user.photos.length === 0) {
      await this.prisma.photo.updateMany({
        where: { userId, isMain: true },
        data: { isMain: false },
      });
      isMain = true;
    }

    const photo = await this.prisma.photo.create({
      data: {
        url: photoUrl,
        isMain,
        user: {
          connect: { id: userId },
        },
      },
    });

    return photo;
  }

  async deletePhoto(userId: string, photoId: string) {
    const photo = await this.prisma.photo.findFirst({
      where: {
        id: photoId,
        userId,
      },
    });

    if (!photo) {
      throw new NotFoundException(`Photo not found or does not belong to user`);
    }

    await this.prisma.photo.delete({
      where: { id: photoId },
    });

    // If the deleted photo was the main one, set another photo as main if available
    if (photo.isMain) {
      const anotherPhoto = await this.prisma.photo.findFirst({
        where: { userId },
      });

      if (anotherPhoto) {
        await this.prisma.photo.update({
          where: { id: anotherPhoto.id },
          data: { isMain: true },
        });
      }
    }

    return { message: 'Photo deleted successfully' };
  }

  async setMainPhoto(userId: string, photoId: string) {
    const photo = await this.prisma.photo.findFirst({
      where: {
        id: photoId,
        userId,
      },
    });

    if (!photo) {
      throw new NotFoundException(`Photo not found or does not belong to user`);
    }

    // Unset all main photos for this user
    await this.prisma.photo.updateMany({
      where: { userId, isMain: true },
      data: { isMain: false },
    });

    // Set this photo as main
    await this.prisma.photo.update({
      where: { id: photoId },
      data: { isMain: true },
    });

    return { message: 'Main photo updated successfully' };
  }

  async filterProfiles(userId: string, filterDto: FilterProfilesDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        interests: true,
        sentLikes: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Extract filter parameters
    const { 
      limit = 10, 
      page = 1, 
      ageRange, 
      maxDistance, 
      interests: filterInterests,
      sortBy = SortBy.DISTANCE 
    } = filterDto;

    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Build the where clause
    const where: any = {
      id: { not: userId },
      gender: { in: user.interestedIn },
      interestedIn: { has: user.gender },
      // Exclude users that the current user has already liked
      NOT: {
        id: {
          in: user.sentLikes.map((like) => like.toUserId),
        },
      },
    };

    // Add age range filter if provided
    if (ageRange && ageRange.length === 2) {
      const [minAge, maxAge] = ageRange;
      const today = new Date();
      const minDate = new Date(today);
      minDate.setFullYear(today.getFullYear() - maxAge);
      const maxDate = new Date(today);
      maxDate.setFullYear(today.getFullYear() - minAge);
      
      where.dateOfBirth = {
        gte: minDate,
        lte: maxDate,
      };
    }

    // Add interests filter if provided
    if (filterInterests && filterInterests.length > 0) {
      where.interests = {
        some: {
          name: {
            in: filterInterests,
          },
        },
      };
    }

    // Add distance filter if provided and user has location
    let orderBy: any = [];
    if (user.location && maxDistance) {
      // Note: This is a simplified approach. In a real app, you'd use PostGIS or similar
      // for accurate distance calculations. This is just a placeholder.
      // The actual implementation would depend on how location data is stored.
      console.log(`Filtering by distance: ${maxDistance}km`);
    }

    // Set up sorting based on sortBy parameter
    switch (sortBy) {
      case SortBy.AGE:
        orderBy.push({ dateOfBirth: 'desc' });
        break;
      case SortBy.INTERESTS:
        orderBy.push({ interests: { _count: 'desc' } });
        break;
      case SortBy.NEWEST:
        orderBy.push({ createdAt: 'desc' });
        break;
      case SortBy.DISTANCE:
      default:
        // Distance sorting would be implemented here if using PostGIS
        // For now, we'll use a default sort
        orderBy.push({ createdAt: 'desc' });
        break;
    }

    // Add secondary sort criteria
    orderBy.push({ profileCompleted: 'desc' });
    
    // Execute the query
    const profiles = await this.prisma.user.findMany({
      where,
      include: {
        photos: {
          orderBy: { isMain: 'desc' },
          take: 5,
        },
        interests: true,
      },
      skip,
      take: limit,
      orderBy,
    });
    
    // Get total count for pagination
    const totalCount = await this.prisma.user.count({ where });

    return {
      profiles: profiles.map(profile => {
        const { password, ...profileWithoutPassword } = profile;
        return profileWithoutPassword;
      }),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async getRecommendations(userId: string, limit: number = 10, page: number = 1) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        interests: true,
        sentLikes: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Get users with matching interests
    const recommendations = await this.prisma.user.findMany({
      where: {
        id: { not: userId },
        gender: { in: user.interestedIn },
        interestedIn: { has: user.gender },
        // Exclude users that the current user has already liked
        NOT: {
          id: {
            in: user.sentLikes.map((like) => like.toUserId),
          },
        },
      },
      include: {
        photos: {
          orderBy: { isMain: 'desc' },
          take: 1,
        },
        interests: true,
      },
      skip,
      take: limit,
      orderBy: [
        // Order by number of common interests (descending)
        { interests: { _count: 'desc' } },
        // Then by profile completion (descending)
        { profileCompleted: 'desc' },
        // Then by creation date (newest first)
        { createdAt: 'desc' },
      ],
    });
    
    // Get total count for pagination
    const totalCount = await this.prisma.user.count({
      where: {
        id: { not: userId },
        gender: { in: user.interestedIn },
        interestedIn: { has: user.gender },
        NOT: {
          id: {
            in: user.sentLikes.map((like) => like.toUserId),
          },
        },
      },
    });

    return {
      recommendations: recommendations.map(recommendation => {
        const { password, ...userWithoutPassword } = recommendation;
        return userWithoutPassword;
      }),
      totalCount,
    };
  }
}
