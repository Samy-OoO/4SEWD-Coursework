import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useData } from '../context/DataContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

export default function SupplierDetails(){
    const { id } = useParams();
    const { suppliers, products, loading, deleteSupplier } = useData();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    if (loading) {
        return <p className="loading-text">Loading supplier...</p>;
    }

    const supplier = suppliers.find((s) => s.id === Number(id));

    if (!supplier) {
        return (
            <EmptyState
                icon="🏢"
                title="Supplier not found"
                message="It may have been deleted, or the link is out of date."
                action={<Button to="/suppliers" variant="secondary">Back to Suppliers</Button>}
            />
        );
    }

    const suppliedProducts = products.filter((p) => p.supplierId === supplier.id);

    async function handleDelete() {
        if (!window.confirm(`Delete "${supplier.name}"? This cannot be undone.`)) return;

        setError(null);
        setDeleting(true);
        try {
            await deleteSupplier(supplier.id);
            navigate('/suppliers');
        } catch (err) {
            setError(err.message || 'Failed to delete the supplier.');
            setDeleting(false);
        }
    }

    return (
        <>
            <p className="breadcrumb">
                <Link to="/suppliers">Suppliers</Link> / {supplier.name}
            </p>

            <div className="product-detail-card supplier-detail-card">
                <div className="product-detail-info">
                    <h1>{supplier.name}</h1>
                    <p><Badge tone="success">● Active</Badge></p>
                    {supplier.desc && <p className="panel-text">{supplier.desc}</p>}

                    {error && <p className="error-text">{error}</p>}

                    <div className="product-detail-actions">
                        <Button to={`/suppliers/edit/${supplier.id}`}>Edit Supplier</Button>
                        <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete Supplier'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="detail-panels">
                <div className="panel">
                    <h2 className="panel-title">Contact</h2>
                    <p className="panel-text">Email: {supplier.email}</p>
                    <p className="panel-text">Phone: {supplier.phone}</p>
                </div>

                <div className="panel supplier-products-panel">
                    <h2 className="panel-title">Products Supplied</h2>
                    {suppliedProducts.length === 0 ? (
                        <p className="panel-empty">This supplier doesn't supply any products yet.</p>
                    ) : (
                        <table className="alerts-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliedProducts.map((p) => (
                                    <tr key={p.id}>
                                        <td><Link to={`/products/${p.id}`}>{p.name}</Link></td>
                                        <td>{p.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
