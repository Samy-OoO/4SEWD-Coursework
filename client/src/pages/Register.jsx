import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ui/ThemeToggle';

const initialForm = {
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setError(null);
      await register({ email: form.email, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  }

  return (
    <div className="login-page">
      <ThemeToggle className="login-theme-toggle" />
      <div className="login-card">
        <Link to="/" className="login-brand">◈ Inventory</Link>

        <h2>Create your account</h2>
        <p className="login-subtitle">Register to manage inventory securely</p>

        {error && <p className="error-text login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" name="email" placeholder="admin@example.com" value={form.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" placeholder="••••••••••" value={form.password} onChange={handleChange} required />

          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" placeholder="••••••••••" value={form.confirmPassword} onChange={handleChange} required />

          <button type="submit" className="btn btn-primary login-submit">Register</button>
        </form>

        <p className="login-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
