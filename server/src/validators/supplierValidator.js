import { body, param } from 'express-validator';

// The server is the final gatekeeper - we never trust that the client
// (or its HTML5 `required` attributes) already checked this.
const nameRule = () =>
  body('name')
    .notEmpty()
    .withMessage('Supplier name is required.')
    .isLength({ max: 100 })
    .withMessage('Supplier name cannot exceed 100 characters.');

const descRule = () =>
  body('desc')
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters.');

const emailRule = () =>
  body('email').notEmpty().withMessage('Contact email is required.').isEmail().withMessage('Must be a valid email address.');

const phoneRule = () =>
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required.')
    .isLength({ min: 7, max: 20 })
    .withMessage('Phone number must be between 7 and 20 characters.');

export const supplierIdValidation = [param('id').isInt().withMessage('Supplier id must be an integer.')];

export const createSupplierValidation = [nameRule(), descRule(), emailRule(), phoneRule()];

export const updateSupplierValidation = [...supplierIdValidation, nameRule(), descRule(), emailRule(), phoneRule()];
