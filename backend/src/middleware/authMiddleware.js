import jwt from 'jsonwebtoken';
import {User} from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization
  ) {
    try {
      
      token = req.headers.authorization;

   
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
}; 