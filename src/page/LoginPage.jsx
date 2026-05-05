import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={header}>
          <div style={logo}>📖</div>
          <h1 style={title}>Welcome back</h1>
          <p style={sub}>Sign in to your Folio account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <input
              className="form-input"
              value={form.usernameOrEmail}
              onChange={set('usernameOrEmail')}
              placeholder="Enter your username or email"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <hr className="divider" />
        <p style={footer}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#c8860a', fontWeight: 700 }}>Join Folio</Link>
        </p>
      </div>
    </div>
  );
}

const wrap = {
  minHeight: 'calc(100vh - 64px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  background: 'linear-gradient(135deg, #fdf6e8 0%, #f5ead4 100%)',
};
const card = {
  background: 'white',
  borderRadius: 12,
  padding: '40px 36px',
  width: '100%',
  maxWidth: 400,
  boxShadow: '0 8px 32px rgba(26,10,0,0.12)',
};
const header = { textAlign: 'center', marginBottom: 28 };
const logo = { fontSize: 48, marginBottom: 12 };
const title = { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#1a0a00' };
const sub = { fontSize: 15, color: '#888', marginTop: 4 };
const footer = { textAlign: 'center', fontSize: 14, color: '#666' };