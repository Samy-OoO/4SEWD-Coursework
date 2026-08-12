import bcrypt from 'bcryptjs';
import { sequelize, Product, Supplier, StockMovement, User } from '../models/index.js';

const defaultSuppliers = [
  { name: 'Tech Grove', desc: 'Supplies gadgets', email: 'tech.grove@gmail.com', phone: '9800000000' },
  { name: 'Elite Sports Suppliers', desc: 'Supplies sports items', email: 'el.sports@gmail.com', phone: '9811111111' },
  { name: 'Virtuoso Music Co.', desc: 'Supplies musical instruments', email: 'virtuoso.music.co@gmail.com', phone: '9822222222' },
];

// supplierName is resolved to a supplierId after suppliers are inserted.
const defaultProducts = [
  { sku: 'LAP-001', category: 'Electronics', image: '/images/laptop.webp', alt: 'Laptop', name: 'Laptop', desc: 'Laptop is a laptop', price: 1000, costPrice: 750, quantity: 20, minStock: 5, supplierName: 'Tech Grove' },
  { sku: 'HDP-002', category: 'Electronics', image: '/images/headphones.webp', alt: 'Headphones', name: 'Headphones', desc: '', price: 50, costPrice: 30, quantity: 15, minStock: 5, supplierName: 'Tech Grove' },
  { sku: 'TEN-003', category: 'Sports', image: '/images/tennis.jfif', alt: 'Tennis Racket', name: 'Tennis Racket', desc: '', price: 29.99, costPrice: 18, quantity: 4, minStock: 5, supplierName: 'Elite Sports Suppliers' },
  { sku: 'BAL-004', category: 'Sports', image: '/images/ball.webp', alt: 'Tennis Ball', name: 'Tennis Ball', desc: '', price: 5, costPrice: 2.5, quantity: 30, minStock: 10, supplierName: 'Elite Sports Suppliers' },
  { sku: 'CAB-005', category: 'Accessories', image: '/images/cable.jpg', alt: 'Cable', name: 'Cable', desc: '', price: 3, costPrice: 1.2, quantity: 15, minStock: 5, supplierName: 'Tech Grove' },
];

// Seeds the database only the first time it's empty, so re-running the
// server never duplicates rows or clobbers data a user has entered.
export async function seedIfEmpty() {
  const supplierCount = await Supplier.count();
  const userCount = await User.count();

  if (supplierCount === 0) {
    const suppliers = await Supplier.bulkCreate(defaultSuppliers);
    const supplierIdByName = Object.fromEntries(suppliers.map((s) => [s.name, s.id]));

    const products = await Product.bulkCreate(
      defaultProducts.map(({ supplierName, ...product }) => ({
        ...product,
        supplierId: supplierIdByName[supplierName],
      })),
    );

    await StockMovement.bulkCreate(
      products
        .filter((p) => p.quantity > 0)
        .map((p) => ({ productId: p.id, change: p.quantity, quantityAfter: p.quantity, reason: 'Initial stock' })),
    );

    console.log('Seeded database with default suppliers and products.');
  }

  if (userCount === 0) {
    const adminPassword = 'admin@123';
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await User.create({ email: 'admin@example.com', passwordHash, role: 'admin' });
    console.log('Seeded admin user: admin@example.com / admin@123');
  }
}

// Allows `npm run seed` to force a (re)seed independently of server startup.
async function runStandalone() {
  await sequelize.sync();
  await seedIfEmpty();
  await sequelize.close();
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  runStandalone()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
