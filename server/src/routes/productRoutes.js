import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  adjustStockValidation,
} from '../validators/productValidator.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/', productController.getProducts);
router.get('/stock-movements', productController.getAllStockMovements);
router.get('/:id', productIdValidation, validate, productController.getProduct);
router.post('/', createProductValidation, validate, productController.createProduct);
router.put('/:id', updateProductValidation, validate, productController.updateProduct);
router.delete('/:id', productIdValidation, validate, productController.deleteProduct);

router.get('/:id/stock-movements', productIdValidation, validate, productController.getStockMovements);
router.post('/:id/stock-movements', adjustStockValidation, validate, productController.adjustStock);

export default router;
