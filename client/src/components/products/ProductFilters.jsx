export default function ProductFilters({
    search,
    onSearchChange,
    stockFilter,
    onStockFilterChange,
    supplierFilter,
    onSupplierFilterChange,
    suppliers,
    sort,
    onSortChange,
}) {
    return (
        <div className="filters-bar">
            <div className="search-input">
                <span className="search-input-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search products or SKU..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <select value={stockFilter} onChange={(e) => onStockFilterChange(e.target.value)}>
                <option value="all">All Stock</option>
                <option value="low">Low Stock</option>
                <option value="healthy">Healthy</option>
            </select>

            <select value={supplierFilter} onChange={(e) => onSupplierFilterChange(e.target.value)}>
                <option value="all">All Suppliers</option>
                {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                ))}
            </select>

            <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
                <option value="name">Sort: Name</option>
                <option value="price">Sort: Price</option>
                <option value="stock">Sort: Stock</option>
                <option value="supplier">Sort: Supplier</option>
            </select>
        </div>
    );
}
