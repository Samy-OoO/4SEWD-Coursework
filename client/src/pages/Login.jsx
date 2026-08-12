import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ui/ThemeToggle';

const initialForm = {
    email: '',
    password: '',
};

export default function Login(){

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState(null);
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    function handleChange(e){
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e){
        e.preventDefault();

        setError(null);
        try {
            await login({ email: form.email, password: form.password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Incorrect email or password.');
        }
    }

    return(
        <div className="login-page">
            <ThemeToggle className="login-theme-toggle" />
            <div className="login-card">
                <Link to="/" className="login-brand">◈ Inventory</Link>

                <h2>Welcome back</h2>
                <p className="login-subtitle">Sign in to manage inventory</p>

                {error && <p className="error-text login-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email" name="email" placeholder="admin@example.com" value={form.email} onChange={handleChange} required />

                    <label>Password</label>
                    <input type="password" name="password" placeholder="••••••••••" value={form.password} onChange={handleChange} required />

                    <button type="submit" className="btn btn-primary login-submit" disabled={isLoading}>
                        {isLoading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>
                <p className="login-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}
