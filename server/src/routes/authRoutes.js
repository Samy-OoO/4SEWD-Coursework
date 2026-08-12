import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { loginValidation, registerValidation } from '../validators/authValidator.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/logout', authController.logout);

export default router;
