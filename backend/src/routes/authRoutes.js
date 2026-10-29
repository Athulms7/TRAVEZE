import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { AuthSession, Itinerary } from '../models/user.js';
import mongoose from 'mongoose';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.put('/profile/password', protect, changePassword);
router.post('/logout', protect, async (req, res, next) => {
  try {
    await AuthSession.deleteOne({ tokenId: req.authSessionId, userId: req.user._id });
    return res.json({ message: 'You have been signed out.' });
  } catch (error) {
    return next(error);
  }
});

router.post('/it', protect, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userid: req.user._id }).sort({ createdAt: -1 });
    return res.json({ itineraries });
  } catch (error) {
    console.error('Failed to load itineraries:', error);
    return res.status(500).json({ message: 'Unable to load itineraries.' });
  }
});

const getUserItinerary = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.data)) {
    return res.status(404).json({ message: 'Itinerary not found.' });
  }

  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.data,
      userid: req.user._id,
    });
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }
    return res.json({ itinerary });
  } catch (error) {
    console.error('Failed to load itinerary:', error);
    return res.status(500).json({ message: 'Unable to load itinerary.' });
  }
};

router.get('/it/:data', protect, getUserItinerary);
router.post('/it/:data', protect, getUserItinerary);

router.delete('/it/:data', protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.data)) {
    return res.status(404).json({ message: 'Itinerary not found.' });
  }

  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.data,
      userid: req.user._id,
    });
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }
    return res.json({ message: 'Itinerary deleted.' });
  } catch (error) {
    console.error('Failed to delete itinerary:', error);
    return res.status(500).json({ message: 'Unable to delete itinerary.' });
  }
});

export default router;