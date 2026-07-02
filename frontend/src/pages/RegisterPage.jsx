import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
            Create an account
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Start analyzing your startup ideas
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'name', label: 'Full name', type: 'text', placeholder: 'Jane Smith' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            { name: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.name}>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: 6,
                letterSpacing: '-0.01em',
              }}>
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleChange}
                className="input"
                placeholder={field.placeholder}
                required
                autoFocus={field.name === 'name'}
              />
            </div>
          ))}

          {error && (
            <p className="error-text" style={{ marginTop: 4 }}>{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: 8, width: '100%', padding: '11px', fontSize: '0.9375rem' }}
          >
            {loading ? <span className="spinner" /> : 'Create account'}
          </button>
        </form>

        <p style={{
          marginTop: 24,
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: 'var(--text-tertiary)',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontWeight: 500,
          }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
