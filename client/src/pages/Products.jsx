import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import ProductFilters from '../components/products/ProductFilters';
import ProductTable from '../components/products/ProductTable';
import AdjustStockModal from '../components/products/AdjustStockModal';

export default function Products(){

    const { products, suppliers, loading, error, deleteProduct, adjustStock } = useData();
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(() => searchParams.get('q') || '');
    const [stockFilter, setStockFilter] = useState('all');
    const [supplierFilter, setSupplierFilter] = useState('all');
    const [sort, setSort] = useState('name');
    const [deletingId, setDeletingId] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [adjustingProduct, setAdjustingProduct] = useState(null);

    const filteredProducts = useMemo(() => {
        const term = search.trim().toLowerCase();

        const filtered = products.filter((p) => {
            const matchesSearch = !term || p.name.toLowerCase().includes(term) || (p.sku || '').toLowerCase().includes(term);
            const isLow = p.quantity <= (p.minStock ?? 5);
            const matchesStock = stockFilter === 'all' || (stockFilter === 'low' ? isLow : !isLow);
            const matchesSupplier = supplierFilter === 'all' || p.supplierId === Number(supplierFilter);
            return matchesSearch && matchesStock && matchesSupplier;
        });

        return [...filtered].sort((a, b) => {
            if (sort === 'price') return a.price - b.price;
            if (sort === 'stock') return a.quantity - b.quantity;
            if (sort === 'supplier') return a.supplierName.localeCompare(b.supplierName);
            return a.name.localeCompare(b.name);
        });
    }, [products, search, stockFilter, supplierFilter, sort]);

    const hasActiveFilters = Boolean(search) || stockFilter !== 'all' || supplierFilter !== 'all';

    function clearFilters() {
        setSearch('');
        setStockFilter('all');
        setSupplierFilter('all');
    }

    async function handleDelete(prod) {
        if (!window.confirm(`Delete "${prod.name}"? This cannot be undone.`)) return;

        setDeleteError(null);
        setDeletingId(prod.id);
        try {
            await deleteProduct(prod.id);
        } catch (err) {
            setDeleteError(err.message || 'Failed to delete the product.');
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <>
            <PageHeader
                title="Products"
                subtitle="Manage and monitor your inventory"
                action={<Button to="/products/new">+ Add Product</Button>}
            />

            {error && <p className="error-text">Couldn't load products: {error}</p>}
            {deleteError && <p className="error-text">{deleteError}</p>}

            <ProductFilters
                search={search}
                onSearchChange={setSearch}
                stockFilter={stockFilter}
                onStockFilterChange={setStockFilter}
                supplierFilter={supplierFilter}
                onSupplierFilterChange={setSupplierFilter}
                suppliers={suppliers}
                sort={sort}
                onSortChange={setSort}
            />

            {!loading && (
                <p className="result-count">
                    {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
                </p>
            )}

            {loading ? (
                <p className="loading-text">Loading products...</p>
            ) : (
                <ProductTable
                    products={filteredProducts}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                    onAdjustStock={setAdjustingProduct}
                    hasFilters={hasActiveFilters}
                    onClearFilters={clearFilters}
                />
            )}

            {adjustingProduct && (
                <AdjustStockModal
                    product={adjustingProduct}
                    onClose={() => setAdjustingProduct(null)}
                    onAdjust={(payload) => adjustStock(adjustingProduct.id, payload)}
                />
            )}
        </>
    );
}
