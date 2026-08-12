import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function AdjustStockModal({ product, onClose, onAdjust }) {
    const [direction, setDirection] = useState('increase');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const parsedAmount = Number(amount) || 0;
    const change = direction === 'increase' ? parsedAmount : -parsedAmount;
    const resultingQuantity = product.quantity + change;

    async function handleSubmit(e) {
        e.preventDefault();

        if (!parsedAmount || parsedAmount <= 0) {
            setError('Enter an amount greater than 0.');
            return;
        }
        if (!reason.trim()) {
            setError('A reason is required.');
            return;
        }
        if (resultingQuantity < 0) {
            setError(`That would take stock below zero (currently ${product.quantity}).`);
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            await onAdjust({ change, reason: reason.trim() });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to adjust stock.');
            setSubmitting(false);
        }
    }

    return (
        <Modal title={`Adjust Stock — ${product.name}`} onClose={onClose}>
            <form onSubmit={handleSubmit} className="adjust-stock-form">
                <div className="stock-direction-toggle">
                    <button
                        type="button"
                        className={direction === 'increase' ? 'active' : ''}
                        onClick={() => setDirection('increase')}
                    >
                        + Increase
                    </button>
                    <button
                        type="button"
                        className={direction === 'decrease' ? 'active' : ''}
                        onClick={() => setDirection('decrease')}
                    >
                        − Decrease
                    </button>
                </div>

                <div className="form-field">
                    <label>Amount</label>
                    <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required autoFocus />
                </div>

                <div className="form-field">
                    <label>Reason</label>
                    <input
                        type="text"
                        placeholder="e.g. Stock received, Sale, Damaged"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                    />
                </div>

                <p className="stock-preview">
                    {product.quantity} → <strong className={resultingQuantity < 0 ? 'stock-preview-negative' : ''}>{resultingQuantity}</strong>
                </p>

                {error && <p className="error-text">{error}</p>}

                <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Apply Adjustment'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
