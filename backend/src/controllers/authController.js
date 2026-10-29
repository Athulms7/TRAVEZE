import jwt from 'jsonwebtoken';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';
import validator from 'validator';
import { AuthSession, PasswordResetToken, User } from '../models/user.js';

const SESSION_LIFETIMES = {
  temporary: 12 * 60 * 60,
  persistent: 30 * 24 * 60 * 60,
};
const PASSWORD_RESET_LIFETIME_MS = 15 * 60 * 1000;

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }
  return secret;
};

const createSessionToken = async (user, rememberMe) => {
  const lifetime = rememberMe ? SESSION_LIFETIMES.persistent : SESSION_LIFETIMES.temporary;
  const tokenId = randomUUID();
  const expiresAt = new Date(Date.now() + lifetime * 1000);

  await AuthSession.create({
    tokenId,
    userId: user._id,
    expiresAt,
  });

  const token = jwt.sign(
    { id: user._id.toString(), authVersion: user.authVersion ?? 0 },
    getJwtSecret(),
    { expiresIn: lifetime, jwtid: tokenId, algorithm: 'HS256' }
  );

  return { token, expiresAt: expiresAt.toISOString() };
};

const publicUser = (user) => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

const isValidationError = (error) =>
  error?.name === 'ValidationError' || error?.name === 'CastError';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      name.trim().length < 2 ||
      name.trim().length > 50 ||
      email.trim().length > 254 ||
      !validator.isEmail(email.trim()) ||
      password.length < 8 ||
      password.length > 128
    ) {
      return res.status(400).json({ message: 'Please provide a valid name, email, and password (8-128 characters).' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const session = await createSessionToken(user, false);
    return res.status(201).json({ ...publicUser(user), ...session });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    if (isValidationError(error)) {
      return res.status(400).json({ message: 'Please check the account details and try again.' });
    }
    console.error('Registration failed:', error);
    return res.status(500).json({ message: 'Unable to create your account right now.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      email.trim().length > 254 ||
      password.length > 128
    ) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const session = await createSessionToken(user, req.body?.rememberMe === true);
    return res.json({ ...publicUser(user), ...session });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ message: 'Unable to sign in right now.' });
  }
};

export const getProfile = async (req, res) => {
  return res.json(publicUser(req.user));
};

export const updateProfile = async (req, res) => {
  const { currentPassword, name, email } = req.body ?? {};
  if (
    typeof currentPassword !== 'string' ||
    currentPassword.length === 0 ||
    currentPassword.length > 128 ||
    (name !== undefined && typeof name !== 'string') ||
    (email !== undefined && typeof email !== 'string') ||
    (name === undefined && email === undefined)
  ) {
    return res.status(400).json({ message: 'Provide your current password and at least one valid profile field.' });
  }

  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Your current password is incorrect.' });
    }

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (trimmedName.length < 2 || trimmedName.length > 50) {
        return res.status(400).json({ message: 'Name must be between 2 and 50 characters.' });
      }
      user.name = trimmedName;
    }
    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail.length > 254 || !validator.isEmail(normalizedEmail)) {
        return res.status(400).json({ message: 'Please provide a valid email address.' });
      }
      user.email = normalizedEmail;
    }

    await user.save();
    return res.json(publicUser(user));
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    if (isValidationError(error)) {
      return res.status(400).json({ message: 'Please check the profile details and try again.' });
    }
    console.error('Profile update failed:', error);
    return res.status(500).json({ message: 'Unable to update your profile right now.' });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};
  if (
    typeof currentPassword !== 'string' ||
    typeof newPassword !== 'string' ||
    currentPassword.length === 0 ||
    currentPassword.length > 128 ||
    newPassword.length < 12 ||
    newPassword.length > 128
  ) {
    return res.status(400).json({ message: 'Enter your current password and a new password of 12-128 characters.' });
  }

  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Your current password is incorrect.' });
    }
    if (await user.matchPassword(newPassword)) {
      return res.status(400).json({ message: 'Choose a new password that is different from your current password.' });
    }

    user.password = newPassword;
    user.authVersion = (user.authVersion ?? 0) + 1;
    await user.save();
    try {
      await AuthSession.deleteMany({ userId: user._id });
    } catch (cleanupError) {
      console.error('Password changed, but expired sessions could not be cleaned up:', cleanupError);
    }

    return res.json({ message: 'Password updated. Please sign in again on your devices.' });
  } catch (error) {
    console.error('Password change failed:', error);
    return res.status(500).json({ message: 'Unable to update your password right now.' });
  }
};

function createPasswordResetTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !process.env.SMTP_FROM) {
    return null;
  }
  const port = Number(SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP_PORT must be a valid TCP port.');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body ?? {};
  if (typeof email !== 'string' || email.trim().length > 254 || !validator.isEmail(email.trim())) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  let transport;
  try {
    transport = createPasswordResetTransport();
  } catch (error) {
    console.error('Password reset email configuration is invalid:', error);
    return res.status(503).json({ message: 'Password recovery is temporarily unavailable. Please try again later.' });
  }
  if (!transport || !process.env.FRONTEND_URL) {
    return res.status(503).json({ message: 'Password recovery is not configured for this service.' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (user) {
      const rawToken = randomBytes(32).toString('hex');
      const tokenHash = createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + PASSWORD_RESET_LIFETIME_MS);
      await PasswordResetToken.deleteMany({ userId: user._id });
      await PasswordResetToken.create({
        tokenHash,
        userId: user._id,
        authVersion: user.authVersion ?? 0,
        expiresAt,
      });

      const resetUrl = new URL('/reset-password', process.env.FRONTEND_URL);
      resetUrl.searchParams.set('token', rawToken);
      try {
        await transport.sendMail({
          from: process.env.SMTP_FROM,
          to: user.email,
          subject: 'Reset your Traveze password',
          text: `Use this link within 15 minutes to reset your password: ${resetUrl.toString()}\n\nIf you did not request this, you can ignore this email.`,
          html: `<p>Use the link below within 15 minutes to reset your Traveze password.</p><p><a href="${resetUrl.toString()}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
        });
      } catch (deliveryError) {
        console.error('Password reset email delivery failed:', deliveryError);
      }
    }

    return res.json({
      message: 'If an account exists for that email, you will receive reset instructions if email delivery is available.',
    });
  } catch (error) {
    console.error('Password reset request failed:', error);
    return res.status(503).json({ message: 'Unable to send password reset instructions right now. Please try again later.' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body ?? {};
  if (
    typeof token !== 'string' ||
    !/^[a-f0-9]{64}$/i.test(token) ||
    typeof newPassword !== 'string' ||
    newPassword.length < 12 ||
    newPassword.length > 128
  ) {
    return res.status(400).json({ message: 'This reset link is invalid or expired, or the new password is not valid.' });
  }

  try {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const resetToken = await PasswordResetToken.findOneAndDelete({
      tokenHash,
      expiresAt: { $gt: new Date() },
    });
    if (!resetToken) {
      return res.status(400).json({ message: 'This reset link is invalid or expired.' });
    }

    const user = await User.findById(resetToken.userId).select('+password');
    if (!user || (user.authVersion ?? 0) !== resetToken.authVersion) {
      return res.status(400).json({ message: 'This reset link is invalid or expired.' });
    }
    if (await user.matchPassword(newPassword)) {
      return res.status(400).json({ message: 'Choose a password that is different from your current password.' });
    }

    user.password = newPassword;
    user.authVersion = (user.authVersion ?? 0) + 1;
    await user.save();
    try {
      await AuthSession.deleteMany({ userId: user._id });
      await PasswordResetToken.deleteMany({ userId: user._id });
    } catch (cleanupError) {
      console.error('Password was reset, but session/token cleanup failed:', cleanupError);
    }

    return res.json({ message: 'Your password has been reset. Sign in with your new password.' });
  } catch (error) {
    console.error('Password reset failed:', error);
    return res.status(500).json({ message: 'Unable to reset your password right now.' });
  }
};
