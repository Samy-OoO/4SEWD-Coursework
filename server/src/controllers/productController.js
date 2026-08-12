import * as productService from '../services/productService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(204).send();
});

export const adjustStock = asyncHandler(async (req, res) => {
  const result = await productService.adjustStock(req.params.id, req.body);
  res.status(201).json(result);
});

export const getStockMovements = asyncHandler(async (req, res) => {
  const movements = await productService.getStockMovements(req.params.id);
  res.json(movements);
});

export const getAllStockMovements = asyncHandler(async (req, res) => {
  const movements = await productService.getAllStockMovements();
  res.json(movements);
});
