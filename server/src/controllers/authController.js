import * as authService from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  const token = authService.generateToken(user);
  res.status(201).json({ user, token });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);
  res.json({ user, token });
});

export const logout = asyncHandler(async (req, res) => {
  res.status(204).send();
});
