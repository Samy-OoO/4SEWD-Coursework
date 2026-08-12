import { Router } from 'express';
import * as supplierController from '../controllers/supplierController.js';
import { createSupplierValidation, updateSupplierValidation, supplierIdValidation } from '../validators/supplierValidator.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/', supplierController.getSuppliers);
router.get('/:id', supplierIdValidation, validate, supplierController.getSupplier);
router.post('/', createSupplierValidation, validate, supplierController.createSupplier);
router.put('/:id', updateSupplierValidation, validate, supplierController.updateSupplier);
router.delete('/:id', supplierIdValidation, validate, supplierController.deleteSupplier);

export default router;
