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
  },
  authVersion: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

const authSessionSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AuthSession = mongoose.model('AuthSession', authSessionSchema);

const passwordResetTokenSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  authVersion: { type: Number, required: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

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
    image:{type:String,required:true},
    shareTokenHash: { type: String, select: false }
}, { timestamps: true });

ItinerarySchema.index({ shareTokenHash: 1 }, { unique: true, sparse: true });

const Itinerary = mongoose.model('itineraries', ItinerarySchema);


export { User, AuthSession, PasswordResetToken, Itinerary };
