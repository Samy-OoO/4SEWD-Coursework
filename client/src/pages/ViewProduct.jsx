import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from "../context/DataContext";
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import AdjustStockModal from '../components/products/AdjustStockModal';
import StockHistory from '../components/products/StockHistory';

export default function ViewProduct(){
    const { id } = useParams();
    const { products, loading, deleteProduct, adjustStock } = useData();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [adjusting, setAdjusting] = useState(false);
    const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

    if (loading) {
        return <p className="loading-text">Loading product...</p>;
    }

    const prod = products.find((p) => p.id === Number(id));

    if(!prod){
        return (
            <EmptyState
                icon="📦"
                title="Product not found"
                message="It may have been deleted, or the link is out of date."
                action={<Button to="/products" variant="secondary">Back to Products</Button>}
            />
        );
    }

    const threshold = prod.minStock ?? 5;
    const isLow = prod.quantity <= threshold;
    const isCritical = prod.quantity <= Math.ceil(threshold / 2);
    const statusTone = isCritical ? 'danger' : isLow ? 'warning' : 'success';
    const statusLabel = isCritical ? 'Critical' : isLow ? 'Low' : 'Healthy';

    async function handleDelete() {
        if (!window.confirm(`Delete "${prod.name}"? This cannot be undone.`)) return;

        setError(null);
        setDeleting(true);
        try {
            await deleteProduct(prod.id);
            navigate('/products');
        } catch (err) {
            setError(err.message || 'Failed to delete the product.');
            setDeleting(false);
        }
    }

    return (
        <>
            <p className="breadcrumb">
                <Link to="/products">Products</Link> / {prod.name}
            </p>

            <div className="product-detail-card">
                {prod.image ? (
                    <img className="product-detail-image" src={prod.image} alt={prod.alt} />
                ) : (
                    <div className="product-detail-image product-detail-image-placeholder">No image</div>
                )}

                <div className="product-detail-info">
                    <h1>{prod.name}</h1>
                    <p className="product-detail-meta">
                        {prod.sku && <span>SKU: {prod.sku}</span>}
                        {prod.category && <span>Category: {prod.category}</span>}
                    </p>

                    <p className="product-detail-price">${prod.price}</p>

                    <p><Badge tone={statusTone}>{prod.quantity} units in stock</Badge></p>

                    <p className="product-detail-supplier">
                        Supplier: <Link to={`/suppliers/${prod.supplierId}`}>{prod.supplierName}</Link>
                    </p>

                    {error && <p className="error-text">{error}</p>}

                    <div className="product-detail-actions">
                        <Button to={`/products/edit/${prod.id}`}>Edit Product</Button>
                        <Button variant="secondary" onClick={() => setAdjusting(true)}>Adjust Stock</Button>
                        <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete Product'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="detail-panels">
                <div className="panel">
                    <h2 className="panel-title">Inventory Information</h2>
                    <div className="inventory-info-grid">
                        <div>
                            <p className="info-label">Current Stock</p>
                            <p className="info-value">{prod.quantity}</p>
                        </div>
                        <div>
                            <p className="info-label">Minimum Stock</p>
                            <p className="info-value">{threshold}</p>
                        </div>
                        <div>
                            <p className="info-label">Status</p>
                            <Badge tone={statusTone}>{statusLabel}</Badge>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <h2 className="panel-title">Product Description</h2>
                    <p className="panel-text">{prod.desc || 'No description provided.'}</p>
                </div>

                <div className="panel">
                    <h2 className="panel-title">Supplier Information</h2>
                    <p className="panel-text"><strong>{prod.supplierName}</strong></p>
                    {prod.Supplier?.email && <p className="panel-text">{prod.Supplier.email}</p>}
                    {prod.Supplier?.phone && <p className="panel-text">{prod.Supplier.phone}</p>}
                    <Link className="panel-link" to={`/suppliers/${prod.supplierId}`}>View supplier →</Link>
                </div>

            </div>

            {adjusting && (
                <AdjustStockModal
                    product={prod}
                    onClose={() => setAdjusting(false)}
                    onAdjust={async (payload) => {
                        await adjustStock(prod.id, payload);
                        setHistoryRefreshKey((k) => k + 1);
                    }}
                />
            )}
        </>
    );
}
