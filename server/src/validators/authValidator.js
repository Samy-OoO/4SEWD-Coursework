import { body } from 'express-validator';

const emailRule = () =>
  body('email').notEmpty().withMessage('Email is required.').isEmail().withMessage('Must be a valid email address.');

const passwordRule = () =>
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.');

export const registerValidation = [emailRule(), passwordRule()];
export const loginValidation = [emailRule(), passwordRule()];
