import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Navigation />
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
