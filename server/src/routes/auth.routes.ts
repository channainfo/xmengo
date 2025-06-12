import express from 'express';
import { 
  register, 
  login, 
  verifyEmail, 
  forgotPassword, 
  resetPassword, 
  googleAuth, 
  googleCallback, 
  facebookAuth, 
  facebookCallback, 
  telegramAuth, 
  telegramCallback,
  getMe 
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Email authentication routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Social authentication routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/facebook', facebookAuth);
router.get('/facebook/callback', facebookCallback);
router.get('/telegram', telegramAuth);
router.get('/telegram/callback', telegramCallback);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
