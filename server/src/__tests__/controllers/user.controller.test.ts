import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getUserProfile, updateUserProfile } from '../../controllers/user.controller';

// Mock Prisma client
const mockPrisma = new PrismaClient();

// Mock request and response objects
const mockRequest = () => {
  const req = {} as Request;
  req.body = {};
  req.params = {};
  (req as any).user = { id: 'test-user-id' };
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe('User Controller', () => {
  describe('getUserProfile', () => {
    it('should return user profile when user is authenticated', async () => {
      // Arrange
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        bio: 'Test bio',
        birthDate: new Date('1990-01-01'),
        gender: 'male',
        interestedIn: ['female'],
        location: { latitude: 40.7128, longitude: -74.006 },
        profilePicture: 'https://example.com/profile.jpg',
        photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      
      const req = mockRequest();
      const res = mockResponse();
      
      // Act
      await getUserProfile(req, res);
      
      // Assert
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        select: expect.objectContaining({
          id: true,
          email: true,
          name: true,
          bio: true
        })
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
    
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      const req = mockRequest();
      (req as any).user = undefined; // User not authenticated
      const res = mockResponse();
      
      // Act
      await getUserProfile(req, res);
      
      // Assert
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    
    it('should return 404 when user is not found', async () => {
      // Arrange
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      const req = mockRequest();
      const res = mockResponse();
      
      // Act
      await getUserProfile(req, res);
      
      // Assert
      expect(mockPrisma.user.findUnique).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
    
    it('should return 500 when an error occurs', async () => {
      // Arrange
      (mockPrisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      const req = mockRequest();
      const res = mockResponse();
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Act
      await getUserProfile(req, res);
      
      // Assert
      expect(mockPrisma.user.findUnique).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });
  
  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const updateData = {
        name: 'Updated Name',
        bio: 'Updated bio',
        birthDate: '1995-05-15',
        gender: 'female',
        interestedIn: ['male'],
        location: { latitude: 34.0522, longitude: -118.2437 }
      };
      
      const updatedUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        ...updateData,
        birthDate: new Date(updateData.birthDate),
        profilePicture: 'https://example.com/profile.jpg',
        photos: ['https://example.com/photo1.jpg'],
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (mockPrisma.user.update as jest.Mock).mockResolvedValue(updatedUser);
      
      const req = mockRequest();
      req.body = updateData;
      const res = mockResponse();
      
      // Act
      await updateUserProfile(req, res);
      
      // Assert
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        data: expect.objectContaining({
          name: updateData.name,
          bio: updateData.bio,
          gender: updateData.gender,
          interestedIn: updateData.interestedIn,
          location: updateData.location
        }),
        select: expect.any(Object)
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });
    
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      const req = mockRequest();
      (req as any).user = undefined; // User not authenticated
      const res = mockResponse();
      
      // Act
      await updateUserProfile(req, res);
      
      // Assert
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
    
    it('should return 500 when an error occurs', async () => {
      // Arrange
      (mockPrisma.user.update as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      const req = mockRequest();
      req.body = { name: 'Updated Name' };
      const res = mockResponse();
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Act
      await updateUserProfile(req, res);
      
      // Assert
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });
});
