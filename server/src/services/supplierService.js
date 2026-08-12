import { Supplier, Product } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

export async function getAllSuppliers() {
  return Supplier.findAll({ order: [['name', 'ASC']] });
}

export async function getSupplierById(id) {
  const supplier = await Supplier.findByPk(id);
  if (!supplier) {
    throw new ApiError(404, `Supplier with id ${id} was not found.`);
  }
  return supplier;
}

export async function createSupplier(data) {
  return Supplier.create({
    name: data.name,
    desc: data.desc || '',
    email: data.email,
    phone: data.phone,
  });
}

export async function updateSupplier(id, data) {
  const supplier = await getSupplierById(id);
  supplier.name = data.name;
  supplier.desc = data.desc || '';
  supplier.email = data.email;
  supplier.phone = data.phone;
  await supplier.save();
  return supplier;
}

export async function deleteSupplier(id) {
  const supplier = await getSupplierById(id);

  const productCount = await Product.count({ where: { supplierId: id } });
  if (productCount > 0) {
    throw new ApiError(409, `Cannot delete "${supplier.name}" - it still supplies ${productCount} product(s). Reassign or delete those products first.`);
  }

  await supplier.destroy();
}
