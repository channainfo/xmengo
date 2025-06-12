import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import passport from 'passport';
import '../config/passport';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create verification token
    const verifyToken = uuidv4();

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verifyToken,
        photos: [],
        interestedIn: [],
      },
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.verifyToken!);

    // Create JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );

    // Return user data without password
    const { password: _, ...userData } = user;

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      user: userData,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user has password (might be social login only)
    if (!user.password) {
      return res.status(400).json({
        message: 'This account uses social login. Please sign in with the appropriate provider.'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.verified) {
      return res.status(400).json({
        message: 'Please verify your email before logging in.'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );

    // Return user data without password
    const { password: _, ...userData } = user;

    res.status(200).json({
      message: 'Login successful',
      user: userData,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // Find user with token
    const user = await prisma.user.findFirst({
      where: { verifyToken: token },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    // Update user to verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verifyToken: null,
      },
    });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create reset token
    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetExpires,
      },
    });

    // Send password reset email
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user with token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user with new password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpires: null,
      },
    });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

// Google authentication
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Google callback
export const googleCallback = (req: Request, res: Response) => {
  passport.authenticate('google', { session: false }, (err: any, user: any, _info: any) => {
    if (err || !user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=Google authentication failed`);
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );

    // Redirect to client with token
    res.redirect(`${process.env.CLIENT_URL}/auth/social-callback?token=${token}`);
  })(req, res);
};

// Facebook authentication
export const facebookAuth = passport.authenticate('facebook', {
  scope: ['email', 'public_profile'],
});

// Facebook callback
export const facebookCallback = (req: Request, res: Response) => {
  passport.authenticate('facebook', { session: false }, (err: any, user: any, _info: any) => {
    if (err || !user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=Facebook authentication failed`);
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );

    // Redirect to client with token
    res.redirect(`${process.env.CLIENT_URL}/auth/social-callback?token=${token}`);
  })(req, res);
};

// Telegram authentication
export const telegramAuth = (req: Request, res: Response) => {
  // Telegram login widget will handle the initial auth
  // This endpoint is just a placeholder for the frontend
  res.status(200).json({ message: 'Use Telegram Login Widget on frontend' });
};

// Telegram callback
export const telegramCallback = async (req: Request, res: Response) => {
  try {
    // Telegram sends auth data directly to the frontend
    // Frontend will send this data to this endpoint
    const { id, first_name, last_name, username, photo_url } = req.body;

    // Validate Telegram auth data (simplified)
    // In a real app, you'd need to verify the hash with the Telegram Bot API

    // Find or create user
    let user = await prisma.user.findFirst({
      where: { telegramId: String(id) },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          name: `${first_name} ${last_name || ''}`.trim(),
          email: `${username}@telegram.user`, // Placeholder email
          telegramId: String(id),
          verified: true, // Telegram users are pre-verified
          profilePicture: photo_url,
          photos: photo_url ? [photo_url] : [],
          interestedIn: [],
        },
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );

    res.status(200).json({
      message: 'Telegram authentication successful',
      user,
      token,
    });
  } catch (error) {
    console.error('Telegram callback error:', error);
    res.status(500).json({ message: 'Server error during Telegram authentication' });
  }
};

// Get current user
export const getMe = async (req: Request, res: Response) => {
  try {
    // User ID is attached by the auth middleware
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data without password
    const { password: _, ...userData } = user;

    res.status(200).json(userData);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error while fetching user data' });
  }
};
