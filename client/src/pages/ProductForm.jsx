import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';

function buildInitialForm(prod) {
    if (!prod) {
        return { sku: '', category: '', name: '', desc: '', qty: '', minStock: '5', costPrice: '', price: '', supplierId: '' };
    }
    return {
        sku: prod.sku || '',
        category: prod.category || '',
        name: prod.name,
        desc: prod.desc || '',
        qty: String(prod.quantity),
        minStock: String(prod.minStock ?? 5),
        costPrice: prod.costPrice != null ? String(prod.costPrice) : '',
        price: String(prod.price),
        supplierId: String(prod.supplierId),
    };
}

// Keyed by product id in the parent below, so switching which product is
// being edited remounts this component and its useState runs fresh -
// no effect needed to "sync" the form to a different product.
function ProductFormFields({ suppliers, initialProduct, isEditMode, onSave, onCancel }) {
    const [form, setForm] = useState(() => buildInitialForm(initialProduct));
    const [imageFile, setImageFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const existingImage = initialProduct?.image || null;

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    }

    function handleFileChange(e) {
        const file = e.target.files[0] || null;
        setImageFile(file);
        setFileName(file ? file.name : '');
    }

    async function saveProduct(imageDataUrl) {
        const payload = {
            sku: form.sku,
            category: form.category,
            name: form.name,
            desc: form.desc,
            price: Number(form.price),
            costPrice: form.costPrice === '' ? null : Number(form.costPrice),
            quantity: Number(form.qty),
            minStock: Number(form.minStock),
            supplierId: Number(form.supplierId),
            alt: form.name,
        };

        // Only send `image` when it changed (a new file was picked), so
        // editing other fields never wipes out an existing photo.
        if (imageDataUrl !== undefined) {
            payload.image = imageDataUrl;
        }

        setSubmitting(true);
        setError(null);
        try {
            await onSave(payload);
        } catch (err) {
            setError(err.message || 'Failed to save the product.');
            setSubmitting(false);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = () => saveProduct(reader.result);
            reader.readAsDataURL(imageFile);
        } else if (isEditMode) {
            // Editing without picking a new file: leave the stored image untouched.
            saveProduct(undefined);
        } else {
            saveProduct(null);
        }
    }

    return (
        <>
            <PageHeader
                title={isEditMode ? 'Edit Product' : 'Add Product'}
                subtitle={isEditMode ? 'Update this inventory item' : 'Create a new inventory item'}
            />

            {error && <p className="error-text form-error">{error}</p>}

            <form onSubmit={handleSubmit} className="form-panel">
                <section className="form-section">
                    <h2 className="form-section-title">Basic Information</h2>

                    <div className="form-field">
                        <label>Product Name *</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label>SKU</label>
                            <input type="text" name="sku" placeholder="e.g. HD-001" value={form.sku} onChange={handleChange} />
                        </div>
                        <div className="form-field">
                            <label>Category</label>
                            <input type="text" name="category" placeholder="e.g. Electronics" value={form.category} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-field">
                        <label>Description</label>
                        <textarea name="desc" value={form.desc} onChange={handleChange}></textarea>
                    </div>
                </section>

                <section className="form-section">
                    <h2 className="form-section-title">Inventory</h2>
                    <div className="form-row">
                        <div className="form-field">
                            <label>Current Stock *</label>
                            <input type="number" name="qty" value={form.qty} onChange={handleChange} min="0" required />
                        </div>
                        <div className="form-field">
                            <label>Minimum Stock *</label>
                            <input type="number" name="minStock" value={form.minStock} onChange={handleChange} min="0" required />
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h2 className="form-section-title">Pricing</h2>
                    <div className="form-row">
                        <div className="form-field">
                            <label>Cost Price</label>
                            <input type="number" name="costPrice" value={form.costPrice} onChange={handleChange} step="0.01" min="0" placeholder="Optional" />
                        </div>
                        <div className="form-field">
                            <label>Selling Price *</label>
                            <input type="number" name="price" value={form.price} onChange={handleChange} step="0.01" min="0" required />
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h2 className="form-section-title">Supplier</h2>
                    <div className="form-field">
                        <label>Supplier *</label>
                        <select name="supplierId" value={form.supplierId} onChange={handleChange} required>
                            <option value="" disabled>Select a supplier</option>
                            {suppliers.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </section>

                <section className="form-section">
                    <h2 className="form-section-title">Product Image</h2>
                    <label className="file-upload-btn" htmlFor="product-image">📷 Upload Image</label>
                    <input type="file" name="product-image" id="product-image" hidden accept="image/*" onChange={handleFileChange}/>
                    {fileName && <span className="file-upload-name">{fileName}</span>}
                    {!fileName && existingImage && <span className="file-upload-name">Current image kept (choose a file to replace it)</span>}
                </section>

                <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Save Product'}
                    </Button>
                </div>
            </form>
        </>
    );
}

export default function ProductForm(){
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const { suppliers, products, addProduct, updateProduct, loading: dataLoading } = useData();
    const navigate = useNavigate();

    if (isEditMode && dataLoading) {
        return <p className="loading-text">Loading product...</p>;
    }

    const initialProduct = isEditMode ? products.find((p) => p.id === Number(id)) : null;

    if (isEditMode && !initialProduct) {
        return <p className="loading-text">Product not found.</p>;
    }

    async function handleSave(payload) {
        if (isEditMode) {
            await updateProduct(id, payload);
        } else {
            await addProduct(payload);
        }
        navigate('/products');
    }

    return (
        <ProductFormFields
            key={isEditMode ? id : 'new'}
            suppliers={suppliers}
            initialProduct={initialProduct}
            isEditMode={isEditMode}
            onSave={handleSave}
            onCancel={() => navigate('/products')}
        />
    );
}
