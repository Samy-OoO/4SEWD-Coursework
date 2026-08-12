import { useEffect, useState } from 'react';
import productService from '../../services/productService';

export default function StockHistory({ productId, refreshKey }) {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch this product's ledger whenever the id changes, or the parent
    // bumps refreshKey after a new adjustment is applied. `ignore` guards
    // against setting state from a stale request if productId changes
    // again before this one resolves.
    useEffect(() => {
        let ignore = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await productService.getStockMovements(productId);
                if (!ignore) setMovements(data);
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load stock history.');
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        load();
        return () => {
            ignore = true;
        };
    }, [productId, refreshKey]);

    if (loading) {
        return <p className="panel-empty">Loading history...</p>;
    }

    if (error) {
        return <p className="error-text">{error}</p>;
    }

    if (movements.length === 0) {
        return <p className="panel-empty">No stock changes recorded yet.</p>;
    }

    return (
        <table className="alerts-table stock-history-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Change</th>
                    <th>Reason</th>
                    <th>Resulting Stock</th>
                </tr>
            </thead>
            <tbody>
                {movements.map((m) => (
                    <tr key={m.id}>
                        <td>{new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td className={m.change > 0 ? 'stock-change-positive' : 'stock-change-negative'}>
                            {m.change > 0 ? `+${m.change}` : m.change}
                        </td>
                        <td>{m.reason}</td>
                        <td>{m.quantityAfter}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
