import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import ActionMenu from '../ui/ActionMenu';

export default function ProductRow({ product, onDelete, deleting, onAdjustStock }) {
    const threshold = product.minStock ?? 5;
    const isLow = product.quantity <= threshold;
    const isCritical = product.quantity <= Math.ceil(threshold / 2);

    return (
        <tr>
            <td>
                <Link to={`/products/${product.id}`} className="product-cell">
                    {product.image ? (
                        <img src={product.image} alt={product.alt} className="product-thumb" />
                    ) : (
                        <div className="product-thumb product-thumb-placeholder">—</div>
                    )}
                    <span>{product.name}</span>
                </Link>
            </td>
            <td className="mono">{product.sku || '—'}</td>
            <td>
                {product.quantity}
                {isLow && (
                    <Badge tone={isCritical ? 'danger' : 'warning'} className="stock-badge-inline">
                        {isCritical ? 'Critical' : 'Low'}
                    </Badge>
                )}
            </td>
            <td>${product.price}</td>
            <td>{product.supplierName}</td>
            <td className="col-actions">
                <ActionMenu>
                    <Link to={`/products/${product.id}`}>View Product</Link>
                    <Link to={`/products/edit/${product.id}`}>Edit Product</Link>
                    <button type="button" onClick={() => onAdjustStock(product)}>Adjust Stock</button>
                    <button type="button" className="action-menu-danger" onClick={() => onDelete(product)} disabled={deleting}>
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </ActionMenu>
            </td>
        </tr>
    );
}
