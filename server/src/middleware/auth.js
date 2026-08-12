import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

export async function authenticate(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authorization header missing or malformed.');
  }

  const token = authorization.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findByPk(payload.id);
    if (!user) {
      throw new ApiError(401, 'Invalid token.');
    }
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Session expired. Please sign in again.');
    }
    throw new ApiError(401, 'Invalid or expired token.');
  }
}

export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'Insufficient permissions.');
    }
    next();
  };
}
