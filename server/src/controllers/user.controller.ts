import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get current user profile
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        birthDate: true,
        gender: true,
        interestedIn: true,
        location: true,
        profilePicture: true,
        photos: true,
        verified: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const {
      name,
      bio,
      birthDate,
      gender,
      interestedIn,
      location
    } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name,
        bio: bio,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        gender: gender,
        interestedIn: interestedIn,
        location: location
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        birthDate: true,
        gender: true,
        interestedIn: true,
        location: true,
        profilePicture: true,
        photos: true,
        verified: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Upload user profile picture
 */
export const uploadProfilePicture = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    // In a real implementation, this would handle file upload to S3 or similar
    // For now, we'll just simulate by accepting a URL
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      res.status(400).json({ message: 'Image URL is required' });
      return;
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profilePicture: imageUrl
      }
    });
    
    res.status(200).json({ message: 'Profile picture updated', user: updatedUser });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Upload user photos
 */
export const uploadPhotos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    // In a real implementation, this would handle multiple file uploads
    // For now, we'll just simulate by accepting an array of URLs
    const { imageUrls } = req.body;
    
    if (!imageUrls || !Array.isArray(imageUrls)) {
      res.status(400).json({ message: 'Image URLs array is required' });
      return;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { photos: true }
    });
    
    const updatedPhotos = [...(user?.photos || []), ...imageUrls];
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        photos: updatedPhotos
      }
    });
    
    res.status(200).json({ message: 'Photos uploaded', user: updatedUser });
  } catch (error) {
    console.error('Error uploading photos:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get user matches
 */
export const getUserMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    // In a real implementation, this would query the Match model
    // For now, we'll just return a mock response
    res.status(200).json({ matches: [] });
  } catch (error) {
    console.error('Error getting user matches:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get user likes
 */
export const getUserLikes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    // In a real implementation, this would query the Like model
    // For now, we'll just return a mock response
    res.status(200).json({ likes: [] });
  } catch (error) {
    console.error('Error getting user likes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Like a user
 */
export const likeUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const targetUserId = req.params.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    if (!targetUserId) {
      res.status(400).json({ message: 'Target user ID is required' });
      return;
    }
    
    // In a real implementation, this would create a Like record
    // For now, we'll just return a mock response
    res.status(200).json({ message: 'User liked' });
  } catch (error) {
    console.error('Error liking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Unlike a user
 */
export const unlikeUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const targetUserId = req.params.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    if (!targetUserId) {
      res.status(400).json({ message: 'Target user ID is required' });
      return;
    }
    
    // In a real implementation, this would delete a Like record
    // For now, we'll just return a mock response
    res.status(200).json({ message: 'User unliked' });
  } catch (error) {
    console.error('Error unliking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get recommended users
 */
export const getRecommendedUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    // In a real implementation, this would use a recommendation algorithm
    // For now, we'll just return a mock response
    res.status(200).json({ recommendations: [] });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
