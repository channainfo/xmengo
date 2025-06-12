import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

interface JwtPayload {
  id: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_secret'
    ) as JwtPayload;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, verified: true },
    });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (!user.verified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }
    
    // Attach user to request
    (req as any).user = user;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
