import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg)',
    }}>
      <div style={{ width: '100%', maxWidth: 360 }}>

        {/* Logo */}
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <Link to="/" style={{
            textDecoration: 'none',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}>
            Launcher
          </Link>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: '1.375rem',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            marginBottom: 6,
            color: 'var(--text-primary)',
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: 6,
              letterSpacing: '-0.01em',
            }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: 6,
              letterSpacing: '-0.01em',
            }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="error-text" style={{ marginTop: 4 }}>{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: 8, width: '100%', padding: '11px', fontSize: '0.9375rem' }}
          >
            {loading ? <span className="spinner" /> : 'Sign in'}
          </button>
        </form>

        <p style={{
          marginTop: 24,
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: 'var(--text-tertiary)',
        }}>
          No account?{' '}
          <Link to="/register" style={{
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontWeight: 500,
          }}>
            Get started
          </Link>
        </p>
      </div>
    </div>
  );
}
