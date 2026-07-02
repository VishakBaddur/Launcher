import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/validate-idea', label: 'Validate' },
    { to: '/generate-plan', label: 'Plan' },
    { to: '/business-model', label: 'Model' },
    { to: '/pitch-deck', label: 'Pitch' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 32px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 32,
      }}>
        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} style={{
          textDecoration: 'none',
          color: 'var(--text-primary)',
          fontSize: '0.9375rem',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          flexShrink: 0,
        }}>
          Launcher
        </Link>

        {/* Nav links */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flex: 1,
          }}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  textDecoration: 'none',
                  color: isActive(link.to) ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  fontWeight: isActive(link.to) ? 500 : 400,
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: isActive(link.to) ? 'var(--surface-2)' : 'transparent',
                  transition: 'all 150ms ease',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => {
                  if (!isActive(link.to)) {
                    e.target.style.color = 'var(--text-primary)';
                    e.target.style.background = 'var(--surface-2)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(link.to)) {
                    e.target.style.color = 'var(--text-secondary)';
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {user ? (
            <>
              <span style={{
                fontSize: '0.8125rem',
                color: 'var(--text-tertiary)',
                letterSpacing: '-0.01em',
              }}>
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-ghost"
                style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ fontSize: '0.875rem', padding: '6px 12px' }}>
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '6px 14px' }}>
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
