import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageHeader from '../components/layout/PageHeader';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

export default function StockAlerts() {
    const { products, loading, error } = useData();

    if (loading) {
        return (
            <>
                <PageHeader title="Stock Alerts" subtitle="Products that need attention" />
                <p className="loading-text">Loading stock alerts...</p>
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageHeader title="Stock Alerts" subtitle="Products that need attention" />
                <p className="error-text">Couldn't load stock alerts. {error}</p>
            </>
        );
    }

    const alerts = products
        .filter((p) => p.quantity <= (p.minStock ?? 5))
        .sort((a, b) => a.quantity - b.quantity);

    return (
        <>
            <PageHeader title="Stock Alerts" subtitle="Products that need attention" />

            {alerts.length === 0 ? (
                <EmptyState
                    icon="✅"
                    title="All caught up"
                    message="Every product is above its minimum stock level."
                    action={<Button to="/products" variant="secondary">View Products</Button>}
                />
            ) : (
                <div className="table-container">
                    <table className="table data-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Stock</th>
                                <th>Minimum</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.map((p) => {
                                const threshold = p.minStock ?? 5;
                                const critical = p.quantity <= Math.ceil(threshold / 2);
                                return (
                                    <tr key={p.id}>
                                        <td>
                                            <Link to={`/products/${p.id}`} className="product-cell">
                                                {p.image ? (
                                                    <img src={p.image} alt={p.alt} className="product-thumb" />
                                                ) : (
                                                    <div className="product-thumb product-thumb-placeholder">—</div>
                                                )}
                                                <span>{p.name}</span>
                                            </Link>
                                        </td>
                                        <td className="mono">{p.sku || '—'}</td>
                                        <td>{p.quantity}</td>
                                        <td>{threshold}</td>
                                        <td><Badge tone={critical ? 'danger' : 'warning'}>{critical ? 'Critical' : 'Low'}</Badge></td>
                                        <td className="col-actions">
                                            <Button to={`/products/edit/${p.id}`} variant="secondary" className="btn-sm">Restock</Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
