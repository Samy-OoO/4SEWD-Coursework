import { Product, Supplier, StockMovement, sequelize } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

const supplierInclude = { model: Supplier, attributes: ['id', 'name', 'email', 'phone'] };

export async function getAllProducts() {
  return Product.findAll({ include: supplierInclude, order: [['name', 'ASC']] });
}

export async function getProductById(id) {
  const product = await Product.findByPk(id, { include: supplierInclude });
  if (!product) {
    throw new ApiError(404, `Product with id ${id} was not found.`);
  }
  return product;
}

async function assertSupplierExists(supplierId) {
  const supplier = await Supplier.findByPk(supplierId);
  if (!supplier) {
    throw new ApiError(400, `supplierId ${supplierId} does not match an existing supplier.`);
  }
}

export async function createProduct(data) {
  await assertSupplierExists(data.supplierId);

  return sequelize.transaction(async (t) => {
    const quantity = Number(data.quantity);

    const product = await Product.create(
      {
        sku: data.sku || null,
        category: data.category || null,
        name: data.name,
        desc: data.desc || '',
        price: Number(data.price),
        costPrice: data.costPrice !== undefined && data.costPrice !== '' ? Number(data.costPrice) : null,
        quantity,
        minStock: data.minStock !== undefined && data.minStock !== '' ? Number(data.minStock) : 5,
        supplierId: Number(data.supplierId),
        image: data.image ?? null,
        alt: data.alt || data.name,
      },
      { transaction: t },
    );

    // Every product's history starts with how much it opened with, so the
    // ledger is complete from day one instead of only covering later edits.
    if (quantity > 0) {
      await StockMovement.create(
        { productId: product.id, change: quantity, quantityAfter: quantity, reason: 'Initial stock' },
        { transaction: t },
      );
    }

    return product;
  });
}

export async function updateProduct(id, data) {
  await assertSupplierExists(data.supplierId);

  return sequelize.transaction(async (t) => {
    const product = await Product.findByPk(id, { transaction: t });
    if (!product) {
      throw new ApiError(404, `Product with id ${id} was not found.`);
    }

    const previousQuantity = product.quantity;
    const nextQuantity = Number(data.quantity);

    product.sku = data.sku || null;
    product.category = data.category || null;
    product.name = data.name;
    product.desc = data.desc || '';
    product.price = Number(data.price);
    product.costPrice = data.costPrice !== undefined && data.costPrice !== '' ? Number(data.costPrice) : null;
    product.quantity = nextQuantity;
    product.minStock = data.minStock !== undefined && data.minStock !== '' ? Number(data.minStock) : product.minStock;
    product.supplierId = Number(data.supplierId);
    // Only overwrite the stored image when a new one was actually sent -
    // editing other fields shouldn't wipe out an existing product photo.
    if (data.image !== undefined) {
      product.image = data.image;
    }
    product.alt = data.alt || data.name;

    await product.save({ transaction: t });

    // The edit form can change quantity directly (not just the dedicated
    // Adjust Stock action) - log it either way so the ledger stays complete.
    if (nextQuantity !== previousQuantity) {
      await StockMovement.create(
        {
          productId: product.id,
          change: nextQuantity - previousQuantity,
          quantityAfter: nextQuantity,
          reason: 'Manual edit',
        },
        { transaction: t },
      );
    }

    return product;
  });
}

export async function deleteProduct(id) {
  const product = await getProductById(id);
  await product.destroy();
}

// The dedicated "Adjust Stock" action: a signed change + a required reason,
// applied atomically so the product's quantity and its ledger entry can
// never drift apart.
export async function adjustStock(id, { change, reason }) {
  const parsedChange = Number(change);
  if (!Number.isInteger(parsedChange) || parsedChange === 0) {
    throw new ApiError(400, 'change must be a non-zero whole number.');
  }
  if (!reason || !reason.trim()) {
    throw new ApiError(400, 'A reason is required for stock adjustments.');
  }

  return sequelize.transaction(async (t) => {
    const product = await Product.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!product) {
      throw new ApiError(404, `Product with id ${id} was not found.`);
    }

    const nextQuantity = product.quantity + parsedChange;
    if (nextQuantity < 0) {
      throw new ApiError(400, `That would take stock below zero (currently ${product.quantity}).`);
    }

    product.quantity = nextQuantity;
    await product.save({ transaction: t });

    const movement = await StockMovement.create(
      { productId: product.id, change: parsedChange, quantityAfter: nextQuantity, reason: reason.trim() },
      { transaction: t },
    );

    return { product, movement };
  });
}

export async function getStockMovements(productId) {
  await getProductById(productId);
  return StockMovement.findAll({ where: { productId }, order: [['createdAt', 'DESC']] });
}

// Powers the Dashboard's inventory trend chart - every movement across
// every product, oldest first, joined with the product's current price
// (movements don't store historical price, so trend values are computed
// using today's prices rather than the price at the time of each change).
export async function getAllStockMovements() {
  return StockMovement.findAll({
    include: [{ model: Product, attributes: ['id', 'name', 'price'] }],
    order: [['createdAt', 'ASC']],
  });
}
