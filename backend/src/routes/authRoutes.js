import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { Itinerary } from '../models/user.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post("/it",protect,async (req,res)=>{
const id=req.user._id
const it=await Itinerary.find({userid:id});
res.json({itenaries:it})
})
router.post("/it/:data",protect,async (req,res)=>{
const id=req.user._id
const data=req.params.data
const it=await Itinerary.find({_id:data});
res.json({itenaries:it})
})


export default router; 