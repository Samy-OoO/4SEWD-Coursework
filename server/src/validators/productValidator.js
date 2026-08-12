import { body, param } from 'express-validator';

const skuRule = () => body('sku').optional({ checkFalsy: true }).isString().isLength({ max: 40 }).withMessage('SKU cannot exceed 40 characters.');

const categoryRule = () =>
  body('category').optional({ checkFalsy: true }).isString().isLength({ max: 50 }).withMessage('Category cannot exceed 50 characters.');

const nameRule = () =>
  body('name')
    .notEmpty()
    .withMessage('Product name is required.')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters.');

const descRule = () =>
  body('desc')
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters.');

const priceRule = () =>
  body('price')
    .notEmpty()
    .withMessage('Price is required.')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number.');

const costPriceRule = () =>
  body('costPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Cost price must be a positive number.');

const quantityRule = () =>
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required.')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a whole number of 0 or more.');

const minStockRule = () =>
  body('minStock')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('Minimum stock must be a whole number of 0 or more.');

const supplierIdRule = () =>
  body('supplierId')
    .notEmpty()
    .withMessage('A supplier must be selected.')
    .isInt()
    .withMessage('supplierId must refer to an existing supplier.');

const imageRule = () => body('image').optional({ nullable: true }).isString();

const altRule = () => body('alt').optional({ checkFalsy: true }).isString().isLength({ max: 150 });

export const productIdValidation = [param('id').isInt().withMessage('Product id must be an integer.')];

export const createProductValidation = [
  skuRule(),
  categoryRule(),
  nameRule(),
  descRule(),
  priceRule(),
  costPriceRule(),
  quantityRule(),
  minStockRule(),
  supplierIdRule(),
  imageRule(),
  altRule(),
];

export const updateProductValidation = [
  ...productIdValidation,
  skuRule(),
  categoryRule(),
  nameRule(),
  descRule(),
  priceRule(),
  costPriceRule(),
  quantityRule(),
  minStockRule(),
  supplierIdRule(),
  imageRule(),
  altRule(),
];

export const adjustStockValidation = [
  ...productIdValidation,
  body('change')
    .notEmpty()
    .withMessage('A change amount is required.')
    .isInt({ min: -100000, max: 100000 })
    .withMessage('change must be a whole number.')
    .custom((value) => Number(value) !== 0)
    .withMessage('change must not be zero.'),
  body('reason')
    .notEmpty()
    .withMessage('A reason is required.')
    .isLength({ max: 150 })
    .withMessage('Reason cannot exceed 150 characters.'),
];
