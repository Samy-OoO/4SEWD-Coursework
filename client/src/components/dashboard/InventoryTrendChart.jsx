import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import productService from '../../services/productService';

// Turns the raw movement ledger into a running "total inventory value"
// series. Movements don't store historical price, so each step uses the
// product's *current* price rather than the price at the time - a
// deliberate simplification, noted in the empty/loading copy below.
function buildValueSeries(movements) {
    let runningValue = 0;
    return movements.map((m) => {
        runningValue += m.change * (m.Product?.price ?? 0);
        return {
            date: new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            timestamp: new Date(m.createdAt).getTime(),
            value: Math.round(runningValue * 100) / 100,
        };
    });
}

export default function InventoryTrendChart() {
    const [movements, setMovements] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        async function load() {
            try {
                const data = await productService.getAllStockMovements();
                if (!ignore) setMovements(data);
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load inventory trend.');
            }
        }

        load();
        return () => {
            ignore = true;
        };
    }, []);

    if (error) {
        return <p className="error-text">{error}</p>;
    }

    if (movements === null) {
        return <p className="panel-empty">Loading trend...</p>;
    }

    const series = buildValueSeries(movements);

    if (series.length < 2) {
        return (
            <p className="panel-empty">
                Make a few stock adjustments (received, sold, damaged...) and your inventory value trend will show up here.
            </p>
        );
    }

    return (
        <div className="trend-chart">
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={series} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} />
                    <YAxis
                        tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `$${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
                        width={44}
                    />
                    <Tooltip
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Inventory Value']}
                        contentStyle={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
                    />
                    <Line type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
            <p className="trend-chart-note">
                Based on {series.length} recorded stock changes, valued at each product's current price.
            </p>
        </div>
    );
}
