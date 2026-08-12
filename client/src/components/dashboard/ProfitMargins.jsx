export default function ProfitMargins({ products }) {
    const withMargins = products
        .filter((p) => p.costPrice != null && p.costPrice > 0 && p.price > 0)
        .map((p) => ({
            id: p.id,
            name: p.name,
            margin: p.price - p.costPrice,
            marginPercent: ((p.price - p.costPrice) / p.price) * 100,
        }))
        .sort((a, b) => b.marginPercent - a.marginPercent)
        .slice(0, 5);

    if (withMargins.length === 0) {
        return <p className="panel-empty">Add a cost price to your products to see profit margins here.</p>;
    }

    return (
        <table className="alerts-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Margin</th>
                    <th>%</th>
                </tr>
            </thead>
            <tbody>
                {withMargins.map((p) => (
                    <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>${p.margin.toFixed(2)}</td>
                        <td>{p.marginPercent.toFixed(0)}%</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
