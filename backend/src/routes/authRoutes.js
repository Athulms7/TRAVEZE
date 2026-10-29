import express from 'express';
import { createHash, randomBytes } from 'node:crypto';
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

router.get('/shared/:token', async (req, res) => {
  res.set('Cache-Control', 'private, no-store');
  res.set('Referrer-Policy', 'no-referrer');

  if (!/^[a-f0-9]{64}$/i.test(req.params.token)) {
    return res.status(404).json({ message: 'This shared itinerary is unavailable.' });
  }

  try {
    const tokenHash = createHash('sha256').update(req.params.token).digest('hex');
    const itinerary = await Itinerary.findOne({ shareTokenHash: tokenHash }).select('-shareTokenHash');
    if (!itinerary) {
      return res.status(404).json({ message: 'This shared itinerary is unavailable.' });
    }

    return res.json({
      itinerary: {
        _id: itinerary._id.toString(),
        title: itinerary.title,
        source: itinerary.source,
        destination: itinerary.destination,
        numberOfDays: itinerary.numberOfDays,
        budget: itinerary.budget,
        days: itinerary.days,
        backpackItems: itinerary.backpackItems,
        image: itinerary.image,
      },
    });
  } catch (error) {
    console.error('Failed to load shared itinerary:', error);
    return res.status(500).json({ message: 'Unable to load this shared itinerary.' });
  }
});

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
    }).select('+shareTokenHash');
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }
    return res.json({
      itinerary: {
        _id: itinerary._id.toString(),
        title: itinerary.title,
        source: itinerary.source,
        destination: itinerary.destination,
        numberOfDays: itinerary.numberOfDays,
        budget: itinerary.budget,
        days: itinerary.days,
        backpackItems: itinerary.backpackItems,
        image: itinerary.image,
        isShared: Boolean(itinerary.shareTokenHash),
      },
    });
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

router.post('/it/:data/share', protect, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.data)) {
    return res.status(404).json({ message: 'Itinerary not found.' });
  }

  try {
    const token = randomBytes(32).toString('hex');
    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: req.params.data, userid: req.user._id },
      { $set: { shareTokenHash: createHash('sha256').update(token).digest('hex') } },
      { new: true, runValidators: true }
    ).select('-shareTokenHash');

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }
    return res.json({ token });
  } catch (error) {
    return next(error);
  }
});

router.delete('/it/:data/share', protect, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.data)) {
    return res.status(404).json({ message: 'Itinerary not found.' });
  }

  try {
    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: req.params.data, userid: req.user._id },
      { $unset: { shareTokenHash: 1 } },
      { new: true }
    ).select('_id');

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }
    return res.json({ message: 'Public itinerary link revoked.' });
  } catch (error) {
    return next(error);
  }
});

export default router;