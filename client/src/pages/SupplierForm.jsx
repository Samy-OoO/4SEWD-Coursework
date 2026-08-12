import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';

function buildInitialForm(sup) {
    if (!sup) {
        return { name: '', desc: '', email: '', phone: '' };
    }
    return {
        name: sup.name,
        desc: sup.desc || '',
        email: sup.email,
        phone: String(sup.phone),
    };
}

// Keyed by supplier id in the parent below, so switching which supplier is
// being edited remounts this component - no effect needed to re-sync state.
function SupplierFormFields({ initialSupplier, isEditMode, onSave, onCancel }) {
    const [form, setForm] = useState(() => buildInitialForm(initialSupplier));
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    function handleChange(e){
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value}));
    }

    async function handleSubmit(e){
        e.preventDefault();

        const payload = {
            name: form.name,
            desc: form.desc,
            email: form.email,
            phone: form.phone,
        };

        setSubmitting(true);
        setError(null);
        try {
            await onSave(payload);
        } catch (err) {
            setError(err.message || 'Failed to save the supplier.');
            setSubmitting(false);
        }
    }

    return (
        <>
            <PageHeader
                title={isEditMode ? 'Edit Supplier' : 'Add Supplier'}
                subtitle={isEditMode ? 'Update this supplier' : 'Create a new supplier'}
            />

            {error && <p className="error-text form-error">{error}</p>}

            <form onSubmit={handleSubmit} className="form-panel">
                <section className="form-section">
                    <h2 className="form-section-title">Supplier Details</h2>

                    <div className="form-field">
                        <label>Supplier Name *</label>
                        <input type="text" name="name" placeholder="Enter supplier name" value={form.name} onChange={handleChange} required />
                    </div>

                    <div className="form-field">
                        <label>Description</label>
                        <textarea name="desc" value={form.desc} onChange={handleChange}></textarea>
                    </div>
                </section>

                <section className="form-section">
                    <h2 className="form-section-title">Contact</h2>
                    <div className="form-row">
                        <div className="form-field">
                            <label>Contact Email *</label>
                            <input type="email" name="email" placeholder="example@gmail.com" value={form.email} onChange={handleChange} required />
                        </div>

                        <div className="form-field">
                            <label>Phone Number *</label>
                            <input type="tel" name="phone" placeholder="98XXXXXXXX" value={form.phone} onChange={handleChange} required />
                        </div>
                    </div>
                </section>

                <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Save Supplier'}
                    </Button>
                </div>
            </form>
        </>
    );
}

export default function SupplierForm(){

    const { id } = useParams();
    const isEditMode = Boolean(id);

    const { suppliers, addSupplier, updateSupplier, loading: dataLoading } = useData();
    const navigate = useNavigate();

    if (isEditMode && dataLoading) {
        return <p className="loading-text">Loading supplier...</p>;
    }

    const initialSupplier = isEditMode ? suppliers.find((s) => s.id === Number(id)) : null;

    if (isEditMode && !initialSupplier) {
        return <p className="loading-text">Supplier not found.</p>;
    }

    async function handleSave(payload) {
        if (isEditMode) {
            await updateSupplier(id, payload);
        } else {
            await addSupplier(payload);
        }
        navigate('/suppliers');
    }

    return (
        <SupplierFormFields
            key={isEditMode ? id : 'new'}
            initialSupplier={initialSupplier}
            isEditMode={isEditMode}
            onSave={handleSave}
            onCancel={() => navigate('/suppliers')}
        />
    );
}
