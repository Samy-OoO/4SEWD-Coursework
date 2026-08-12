import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import productService from '../services/productService';
import supplierService from '../services/supplierService';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

// The API eager-loads each product's Supplier association. We flatten a
// `supplierName` onto the product so existing UI code (search/filter/table)
// can keep reading a plain string, the same way it did with localStorage.
function normalizeProduct(product) {
  return {
    ...product,
    supplierName: product.Supplier?.name ?? '',
  };
}

export function DataProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, suppliersData] = await Promise.all([productService.getAll(), supplierService.getAll()]);
      setProducts(productsData.map(normalizeProduct));
      setSuppliers(suppliersData);
    } catch (err) {
      setError(err.message || 'Failed to load data from the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch once on mount. `ignore` guards against setting state from a
  // stale request if this component unmounts before the fetch resolves.
  useEffect(() => {
    if (!isLoggedIn) {
      setProducts([]);
      setSuppliers([]);
      setLoading(false);
      return;
    }

    let ignore = false;

    (async () => {
      await refresh();
      if (ignore) return;
    })();

    return () => {
      ignore = true;
    };
  }, [isLoggedIn, refresh]);

  async function addProduct(product) {
    const created = await productService.create(product);
    setProducts((prev) => [...prev, normalizeProduct(created)]);
    return created;
  }

  async function updateProduct(id, product) {
    const updated = await productService.update(id, product);
    setProducts((prev) => prev.map((p) => (p.id === Number(id) ? normalizeProduct(updated) : p)));
    return updated;
  }

  async function deleteProduct(id) {
    await productService.remove(id);
    setProducts((prev) => prev.filter((p) => p.id !== Number(id)));
  }

  async function adjustStock(id, payload) {
    const { product } = await productService.adjustStock(id, payload);
    setProducts((prev) => prev.map((p) => (p.id === Number(id) ? normalizeProduct({ ...p, ...product, Supplier: p.Supplier }) : p)));
    return product;
  }

  async function addSupplier(supplier) {
    const created = await supplierService.create(supplier);
    setSuppliers((prev) => [...prev, created]);
    return created;
  }

  async function updateSupplier(id, supplier) {
    const updated = await supplierService.update(id, supplier);
    setSuppliers((prev) => prev.map((s) => (s.id === Number(id) ? updated : s)));
    // The product list denormalizes supplier name/contact info, so a
    // supplier edit needs to refresh products too or the table goes stale.
    setProducts((prev) => prev.map((p) => (p.supplierId === Number(id) ? { ...p, supplierName: updated.name } : p)));
    return updated;
  }

  async function deleteSupplier(id) {
    await supplierService.remove(id);
    setSuppliers((prev) => prev.filter((s) => s.id !== Number(id)));
  }

  const value = {
    products,
    suppliers,
    loading,
    error,
    refresh,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
