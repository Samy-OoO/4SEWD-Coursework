import { Router } from 'express';
import productRoutes from './productRoutes.js';
import supplierRoutes from './supplierRoutes.js';
import authRoutes from './authRoutes.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/products', authenticate, productRoutes);
router.use('/suppliers', authenticate, supplierRoutes);

export default router;
