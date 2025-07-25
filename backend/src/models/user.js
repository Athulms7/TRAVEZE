import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

const ActivitySchema = new mongoose.Schema({
    time: String,
    activity: String
});

const DaySchema = new mongoose.Schema({
    day: Number,
    activities: [ActivitySchema]
});

const ItinerarySchema = new mongoose.Schema({
    title: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    numberOfDays: { type: Number, required: true },
    budget: { type: Number, required: true },
    days: [DaySchema],
    backpackItems: [String],
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image:{type:String,required:true}
}, { timestamps: true });

const Itinerary = mongoose.model('itineraries', ItinerarySchema);


export { User, Itinerary };
