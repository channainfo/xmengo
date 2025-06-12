import express from 'express';
import { 
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  addPhotoToGallery,
  removePhotoFromGallery,
  getUserMatches,
  getUserLikes,
  likeUser,
  unlikeUser,
  getRecommendedUsers
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/profile/picture', uploadProfilePicture);
router.post('/photos', addPhotoToGallery);
router.delete('/photos/:photoId', removePhotoFromGallery);

// Match and like routes
router.get('/matches', getUserMatches);
router.get('/likes', getUserLikes);
router.post('/like/:userId', likeUser);
router.delete('/like/:userId', unlikeUser);

// Recommendation routes
router.get('/recommendations', getRecommendedUsers);

export default router;
