import { useData } from '../context/DataContext';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/dashboard/StatCard';
import StockAlerts from '../components/dashboard/StockAlerts';

export default function Dashboard() {
    const { products, suppliers, loading, error } = useData();

    if (loading) {
        return (
            <>
                <PageHeader title="Dashboard" subtitle="Overview of your inventory" />
                <p className="loading-text">Loading dashboard...</p>
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageHeader title="Dashboard" subtitle="Overview of your inventory" />
                <p className="error-text">We couldn't load your dashboard. {error}</p>
            </>
        );
    }

    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);
    const lowStockCount = products.filter((p) => p.quantity <= (p.minStock ?? 5)).length;
    const totalSuppliers = suppliers.length;

    const productsBySupplier = suppliers
        .map((s) => ({ name: s.name, count: products.filter((p) => p.supplierId === s.id).length }))
        .sort((a, b) => b.count - a.count);
    const maxCount = Math.max(1, ...productsBySupplier.map((s) => s.count));

    return (
        <>
            <PageHeader title="Dashboard" subtitle="Overview of your inventory" />

            <div className="kpi-grid">
                <StatCard label="Total Products" value={totalProducts} />
                <StatCard label="Inventory Value" value={`$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
                <StatCard
                    label="Low Stock"
                    value={lowStockCount}
                    delta={lowStockCount > 0 ? 'Needs attention' : 'All good'}
                    deltaTone={lowStockCount > 0 ? 'warning' : 'success'}
                />
                <StatCard label="Suppliers" value={totalSuppliers} />
            </div>

            <div className="dashboard-grid dashboard-grid-3">
                <div className="panel">
                    <div className="panel-header">
                        <h2 className="panel-title">Products by Supplier</h2>
                    </div>

                    {productsBySupplier.length === 0 ? (
                        <p className="panel-empty">No suppliers yet.</p>
                    ) : (
                        <div className="supplier-bars">
                            {productsBySupplier.map((s) => (
                                <div className="supplier-bar-row" key={s.name}>
                                    <span className="supplier-bar-label">{s.name}</span>
                                    <div className="supplier-bar-track">
                                        <div className="supplier-bar-fill" style={{ width: `${(s.count / maxCount) * 100}%` }} />
                                    </div>
                                    <span className="supplier-bar-count">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <StockAlerts products={products} />
            </div>
        </>
    );
}
