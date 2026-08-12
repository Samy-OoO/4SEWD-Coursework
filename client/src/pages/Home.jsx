import { Link } from 'react-router-dom';
import DashboardPreview from '../components/landing/DashboardPreview';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Home() {
    return (
        <div className="landing">
            <nav className="landing-nav">
                <Link to="/" className="landing-brand">
                    <span className="sidebar-brand-mark">◈</span> Inventory
                </Link>
                <div className="landing-nav-links">
                    <a href="#features">Features</a>
                    <a href="#about">About</a>
                </div>
                <div className="landing-nav-right">
                    <Link to="/login" className="btn btn-primary">Login</Link>
                    <ThemeToggle className="landing-theme-toggle" />
                </div>
            </nav>

            <section className="landing-hero">
                <div className="hero-copy">
                    <h1>Simple inventory management for your business.</h1>
                    <p>Track products, monitor stock, and manage suppliers — all in one simple system.</p>
                    <div className="hero-actions">
                        <Link to="/login" className="btn btn-primary">Get Started</Link>
                        <a href="#features" className="btn btn-secondary">Learn More</a>
                    </div>
                </div>
                <DashboardPreview compact />
            </section>

            <section id="features" className="landing-section">
                <h2 className="section-title">Everything you need to manage inventory</h2>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📦</div>
                        <h3>Product Management</h3>
                        <p>Add, edit, search, and manage your products in one place.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Stock Monitoring</h3>
                        <p>Keep track of stock levels and quickly identify low-stock products.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🏢</div>
                        <h3>Supplier Management</h3>
                        <p>Organize suppliers and see which products they provide.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📈</div>
                        <h3>Simple Dashboard</h3>
                        <p>Get a quick overview of your inventory and important alerts.</p>
                    </div>
                </div>
            </section>

            <section className="landing-section steps-section">
                <div className="steps-grid">
                    <div className="step">
                        <span className="step-number">01</span>
                        <h3>Add Products</h3>
                        <p>Create your inventory items.</p>
                    </div>
                    <div className="step">
                        <span className="step-number">02</span>
                        <h3>Monitor Stock</h3>
                        <p>Keep track of stock levels.</p>
                    </div>
                    <div className="step">
                        <span className="step-number">03</span>
                        <h3>Manage Suppliers</h3>
                        <p>Organize your suppliers.</p>
                    </div>
                </div>
            </section>

            <section className="landing-section preview-section">
                <h2 className="section-title">Your inventory at a glance</h2>
                <DashboardPreview />
            </section>

            <section id="about" className="landing-section cta-section">
                <h2>Ready to manage your inventory?</h2>
                <p>Keep your products, stock, and suppliers organized in one simple system.</p>
                <Link to="/login" className="btn btn-primary">Get Started</Link>
            </section>

            <footer className="landing-footer">
                <p className="landing-brand"><span className="sidebar-brand-mark">◈</span> Inventory</p>
                <p>Simple inventory management for small businesses.</p>
                <p className="landing-footer-copy">© 2026 Inventory Management System</p>
            </footer>
        </div>
    );
}
