import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ActionMenu from '../components/ui/ActionMenu';
import EmptyState from '../components/ui/EmptyState';

export default function Suppliers(){
    const { suppliers, products, loading, error, deleteSupplier } = useData();
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const filteredSuppliers = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return suppliers;
        return suppliers.filter((s) => s.name.toLowerCase().includes(term));
    }, [suppliers, search]);

    function productCountFor(supplierId) {
        return products.filter((p) => p.supplierId === supplierId).length;
    }

    async function handleDelete(sup) {
        if (!window.confirm(`Delete "${sup.name}"? This cannot be undone.`)) return;

        setDeleteError(null);
        setDeletingId(sup.id);
        try {
            await deleteSupplier(sup.id);
        } catch (err) {
            setDeleteError(err.message || 'Failed to delete the supplier.');
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <>
            <PageHeader
                title="Suppliers"
                subtitle="Manage your suppliers and their products"
                action={<Button to="/suppliers/new">+ Add Supplier</Button>}
            />

            {error && <p className="error-text">Couldn't load suppliers: {error}</p>}
            {deleteError && <p className="error-text">{deleteError}</p>}

            <div className="filters-bar">
                <div className="search-input">
                    <span className="search-input-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search suppliers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <p className="loading-text">Loading suppliers...</p>
            ) : filteredSuppliers.length === 0 ? (
                <EmptyState
                    icon="🏢"
                    title={search ? 'No suppliers found' : 'No suppliers yet'}
                    message={search ? 'Try a different search.' : 'Add your first supplier to get started.'}
                    action={!search && <Button to="/suppliers/new">+ Add Supplier</Button>}
                />
            ) : (
                <div className="table-container">
                    <table className="table data-table">
                        <thead>
                            <tr>
                                <th>Supplier</th>
                                <th>Products</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSuppliers.map((sup) => (
                                <tr key={sup.id}>
                                    <td>
                                        <Link to={`/suppliers/${sup.id}`} className="product-cell">{sup.name}</Link>
                                    </td>
                                    <td>{productCountFor(sup.id)}</td>
                                    <td>{sup.phone}</td>
                                    <td><Badge tone="success">● Active</Badge></td>
                                    <td className="col-actions">
                                        <ActionMenu>
                                            <Link to={`/suppliers/${sup.id}`}>View Supplier</Link>
                                            <Link to={`/suppliers/edit/${sup.id}`}>Edit Supplier</Link>
                                            <button
                                                type="button"
                                                className="action-menu-danger"
                                                onClick={() => handleDelete(sup)}
                                                disabled={deletingId === sup.id}
                                            >
                                                {deletingId === sup.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </ActionMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
