import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      await register(form);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={header}>
          <div style={logo}>📖</div>
          <h1 style={title}>Join Folio</h1>
          <p style={sub}>Create your free account and start reviewing</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.fullName} onChange={set('fullName')} placeholder="Your full name" />
          </div>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input className="form-input" value={form.username} onChange={set('username')} placeholder="Choose a username" required minLength={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-input" type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters" required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <hr className="divider" />
        <p style={footer}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#c8860a', fontWeight: 700 }}>Sign In</Link>
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
  maxWidth: 420,
  boxShadow: '0 8px 32px rgba(26,10,0,0.12)',
};
const header = { textAlign: 'center', marginBottom: 28 };
const logo = { fontSize: 48, marginBottom: 12 };
const title = { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#1a0a00' };
const sub = { fontSize: 15, color: '#888', marginTop: 4 };
const footer = { textAlign: 'center', fontSize: 14, color: '#666' };