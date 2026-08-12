import sequelize from '../config/database.js';
import Product from './Product.js';
import Supplier from './Supplier.js';
import StockMovement from './StockMovement.js';
import User from './User.js';

// One supplier can supply many products; each product belongs to one supplier.
// This adds a `supplierId` foreign key column onto the products table.
Supplier.hasMany(Product, {
  foreignKey: 'supplierId',
  onDelete: 'RESTRICT', // don't allow deleting a supplier that still has products
});
Product.belongsTo(Supplier, {
  foreignKey: 'supplierId',
});

// A product's stock history. If a product is deleted, its history goes
// with it - there's nothing meaningful left for those rows to reference.
Product.hasMany(StockMovement, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
});
StockMovement.belongsTo(Product, {
  foreignKey: 'productId',
});

export { sequelize, Product, Supplier, StockMovement, User };
