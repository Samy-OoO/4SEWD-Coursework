import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';

export default function StockAlerts({ products }) {
    const alerts = products
        .filter((p) => p.quantity <= (p.minStock ?? 5))
        .sort((a, b) => a.quantity - b.quantity);

    const visible = alerts.slice(0, 6);

    return (
        <div className="panel">
            <div className="panel-header">
                <h2 className="panel-title">Stock Alerts</h2>
            </div>

            {alerts.length === 0 ? (
                <p className="panel-empty">All products are sufficiently stocked.</p>
            ) : (
                <table className="alerts-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {visible.map((p) => {
                            const critical = p.quantity <= Math.ceil((p.minStock ?? 5) / 2);
                            return (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td>{p.quantity}</td>
                                    <td>
                                        <Badge tone={critical ? 'danger' : 'warning'}>{critical ? 'Critical' : 'Low'}</Badge>
                                    </td>
                                    <td>
                                        <Link to={`/products/edit/${p.id}`}>Restock</Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            {alerts.length > 0 && (
                <Link className="panel-link" to="/stock-alerts">
                    View all alerts →
                </Link>
            )}
        </div>
    );
}
