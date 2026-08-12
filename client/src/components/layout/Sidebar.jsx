import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <NavLink to="/dashboard" className="sidebar-brand">
                <span className="sidebar-brand-mark">◈</span>
                <span className="sidebar-brand-name">Inventory</span>
            </NavLink>

            <nav className="sidebar-nav">
                <div className="sidebar-group">
                    <p className="sidebar-group-label">Overview</p>
                    <NavLink to="/dashboard" end className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
                        <span className="sidebar-link-icon">▣</span>
                        Dashboard
                    </NavLink>
                </div>

                <div className="sidebar-group">
                    <p className="sidebar-group-label">Inventory</p>
                    <NavLink to="/products" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
                        <span className="sidebar-link-icon">▣</span>
                        Products
                    </NavLink>
                    <NavLink to="/stock-alerts" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
                        <span className="sidebar-link-icon">▣</span>
                        Stock Alerts
                    </NavLink>
                </div>

                <div className="sidebar-group">
                    <p className="sidebar-group-label">Suppliers</p>
                    <NavLink to="/suppliers" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
                        <span className="sidebar-link-icon">▣</span>
                        Suppliers
                    </NavLink>
                </div>
            </nav>
        </aside>
    );
}
