import jwt from 'jsonwebtoken';
import { AuthSession, User } from '../models/user.js';

export const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ message: 'Authentication is required.' });
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ message: 'Authentication token is invalid or expired.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Authentication token is invalid or expired.' });
    }
    return next(error);
  }

  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    typeof decoded.id !== 'string' ||
    typeof decoded.jti !== 'string' ||
    !Number.isInteger(decoded.authVersion)
  ) {
    return res.status(401).json({ message: 'Authentication token is invalid or expired.' });
  }

  try {
    const [user, session] = await Promise.all([
      User.findById(decoded.id),
      AuthSession.findOne({
        tokenId: decoded.jti,
        userId: decoded.id,
        expiresAt: { $gt: new Date() },
      }),
    ]);
    if (!user || !session || user.authVersion !== decoded.authVersion) {
      return res.status(401).json({ message: 'Authentication token is invalid or expired.' });
    }

    req.user = user;
    req.authSessionId = decoded.jti;
    return next();
  } catch (error) {
    return next(error);
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin.' });
  }
}; 