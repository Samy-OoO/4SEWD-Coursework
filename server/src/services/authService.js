import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import config from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const JWT_EXPIRATION = config.jwtExpiration || '8h';

export async function registerUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ where: { email: normalizedEmail } });
  if (existing) {
    throw new ApiError(409, 'Email is already registered.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email: normalizedEmail, passwordHash, role: 'admin' });
  return { id: user.id, email: user.email, role: user.role };
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) {
    throw new ApiError(401, 'Incorrect email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Incorrect email or password.');
  }

  return {
    user: { id: user.id, email: user.email, role: user.role },
    token: generateToken(user),
  };
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: JWT_EXPIRATION },
  );
}
