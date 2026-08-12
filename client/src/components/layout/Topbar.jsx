import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import ThemeToggle from '../ui/ThemeToggle';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/stock-alerts': 'Stock Alerts',
  '/suppliers': 'Suppliers',
  '/products/new': 'Add Product',
  '/suppliers/new': 'Add Supplier',
};

function getTitle(pathname) {
  if (pathname.startsWith('/products/edit')) return 'Edit Product';
  if (pathname.startsWith('/suppliers/edit')) return 'Edit Supplier';
  if (pathname.startsWith('/products/')) return 'Product Details';
  if (pathname.startsWith('/suppliers/')) return 'Supplier Details';
  return pageTitles[pathname] || '';
}

export default function Topbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const { products } = useData();

    const lowStockCount = products.filter((p) => p.quantity <= (p.minStock ?? 5)).length;
    const pageTitle = getTitle(location.pathname);

    function handleLogout() {
        setMenuOpen(false);
        logout();
        navigate('/login');
    }

    return (
        <header className="topbar">
            <div className="topbar-title">
                {pageTitle && <h2 className="topbar-page-title">{pageTitle}</h2>}
            </div>
            <div className="topbar-actions">
                <ThemeToggle className="topbar-icon-btn" />

                <Link to="/stock-alerts" className="topbar-icon-btn" aria-label="Stock alerts">
                    🔔
                    {lowStockCount > 0 && <span className="topbar-notif-dot">{lowStockCount}</span>}
                </Link>

                <div className="topbar-user">
                    <button type="button" className="topbar-user-btn" onClick={() => setMenuOpen((v) => !v)}>
                        <span className="topbar-avatar">{user?.email?.charAt(0).toUpperCase() || 'A'}</span>
                        {user?.email ?? 'Admin'}
                        <span className="topbar-caret">▾</span>
                    </button>
                    {menuOpen && (
                        <div className="topbar-dropdown">
                            <button type="button" onClick={handleLogout}>Log out</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
