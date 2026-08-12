import ProductRow from './ProductRow';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';

export default function ProductTable({ products, onDelete, deletingId, onAdjustStock, hasFilters, onClearFilters }) {
    if (products.length === 0) {
        return (
            <EmptyState
                icon="📦"
                title={hasFilters ? 'No products found' : 'No products yet'}
                message={hasFilters ? 'Try adjusting your search or filters.' : 'Add your first product to get started.'}
                action={
                    hasFilters ? (
                        <Button variant="secondary" onClick={onClearFilters}>Clear Filters</Button>
                    ) : (
                        <Button to="/products/new">+ Add Product</Button>
                    )
                }
            />
        );
    }

    return (
        <div className="table-container">
            <table className="table data-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Supplier</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <ProductRow key={p.id} product={p} onDelete={onDelete} deleting={deletingId === p.id} onAdjustStock={onAdjustStock} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
