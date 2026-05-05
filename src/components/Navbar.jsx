import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQ, setSearchQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/books?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchQ('');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>📖</span>
          <span style={styles.logoText}>Folio</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search books, authors..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>🔍</button>
        </form>

        {/* Nav links */}
        <div style={styles.links}>
          <Link to="/books" style={styles.link}>Explore</Link>
          {user ? (
            <>
              <Link to="/books/new" style={styles.link}>Add Book</Link>
              <Link to={`/profile/${user.id}`} style={styles.link}>Profile</Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Sign In</Link>
              <Link to="/register" style={styles.registerBtn}>Join Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#1a0a00',
    borderBottom: '3px solid #c8860a',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  },
  logoIcon: { fontSize: 24 },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 24,
    fontWeight: 700,
    color: '#e6a012',
    letterSpacing: '-0.5px',
  },
  searchForm: {
    flex: 1,
    display: 'flex',
    maxWidth: 400,
    gap: 0,
  },
  searchInput: {
    flex: 1,
    padding: '8px 14px',
    border: 'none',
    borderRadius: '4px 0 0 4px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: 14,
    fontFamily: "'Lato', sans-serif",
    outline: 'none',
  },
  searchBtn: {
    padding: '8px 12px',
    background: '#c8860a',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontSize: 14,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  link: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600,
    padding: '6px 12px',
    borderRadius: 4,
    transition: 'color 0.2s',
  },
  registerBtn: {
    background: '#c8860a',
    color: 'white',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 700,
    padding: '7px 16px',
    borderRadius: 4,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: 600,
    padding: '7px 16px',
    borderRadius: 4,
    cursor: 'pointer',
  },
};