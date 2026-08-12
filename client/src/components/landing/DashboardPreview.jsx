import { useData } from '../../context/DataContext';

// A real (not faked) miniature of the Dashboard, built from live data.
// `compact` renders the smaller version used inline in the hero.
export default function DashboardPreview({ compact = false }) {
    const { products } = useData();

    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);
    const lowStock = products
        .filter((p) => p.quantity <= (p.minStock ?? 5))
        .sort((a, b) => a.quantity - b.quantity);

    return (
        <div className={`preview-card ${compact ? 'preview-card-compact' : ''}`}>
            <div className="preview-card-header">Dashboard</div>

            <div className="preview-kpis">
                <div className="preview-kpi">
                    <span className="preview-kpi-label">Products</span>
                    <span className="preview-kpi-value">{totalProducts}</span>
                </div>
                <div className="preview-kpi">
                    <span className="preview-kpi-label">Inventory</span>
                    <span className="preview-kpi-value">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="preview-kpi">
                    <span className="preview-kpi-label">Low Stock</span>
                    <span className="preview-kpi-value preview-kpi-warning">{lowStock.length}</span>
                </div>
            </div>

            {!compact && (
                <div className="preview-alerts">
                    <p className="preview-alerts-title">⚠ Stock Alerts</p>
                    {lowStock.length === 0 ? (
                        <p className="preview-alerts-empty">Nothing needs attention right now.</p>
                    ) : (
                        <ul>
                            {lowStock.slice(0, 3).map((p) => (
                                <li key={p.id}>
                                    <span>{p.name}</span>
                                    <span>{p.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
