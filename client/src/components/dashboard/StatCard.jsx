// deltaTone: 'success' | 'warning' | 'danger' | 'neutral'
export default function StatCard({ label, value, delta, deltaTone = 'neutral' }) {
    return (
        <div className="kpi-card">
            <p className="kpi-label">{label}</p>
            <p className="kpi-value">{value}</p>
            {delta && <p className={`kpi-delta kpi-delta-${deltaTone}`}>{delta}</p>}
        </div>
    );
}
