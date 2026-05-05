import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../api';
import BookCard from '../components/BookCard';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newest, setNewest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      booksAPI.getAll({ sort: 'top-rated', size: 6 }),
      booksAPI.getAll({ sort: 'newest', size: 6 }),
    ]).then(([top, new_]) => {
      setFeatured(top.data.content || []);
      setNewest(new_.data.content || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div style={hero.wrap}>
        <div style={hero.overlay} />
        <div style={hero.content}>
          <p style={hero.eyebrow}>📚 Welcome to Folio</p>
          <h1 style={hero.title}>Discover Books<br /><em>Worth Reading</em></h1>
          <p style={hero.sub}>
            Read honest reviews from real readers. Share your thoughts.<br />
            Build your personal reading list.
          </p>
          <div style={hero.ctas}>
            <Link to="/books" style={hero.ctaPrimary}>Explore Books</Link>
            <Link to="/register" style={hero.ctaSecondary}>Join the Community</Link>
          </div>
        </div>
        <div style={hero.bookStack}>
          {['📗', '📘', '📙', '📕', '📔'].map((emoji, i) => (
            <div key={i} style={{ ...hero.bookEmoji, transform: `rotate(${(i - 2) * 8}deg) translateY(${Math.abs(i - 2) * 6}px)`, zIndex: 5 - i }}>
              {emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={stats.bar}>
        <div style={stats.inner}>
          {[
            { icon: '📚', label: 'Books Catalogued', val: '10,000+' },
            { icon: '✍️', label: 'Reviews Written', val: '50,000+' },
            { icon: '👤', label: 'Active Readers', val: '5,000+' },
            { icon: '⭐', label: 'Avg. Rating Quality', val: '4.2 / 5' },
          ].map((s, i) => (
            <div key={i} style={stats.item}>
              <span style={stats.icon}>{s.icon}</span>
              <div>
                <div style={stats.val}>{s.val}</div>
                <div style={stats.lbl}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        {/* Top rated */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
            <div>
              <h2 className="section-title">⭐ Top Rated Books</h2>
              <p className="section-subtitle">Highest rated by our community</p>
            </div>
            <Link to="/books?sort=top-rated" style={{ color: '#c8860a', fontWeight: 700, fontSize: 14 }}>View all →</Link>
          </div>
          {loading ? <div className="spinner" /> : (
            <div style={grid}>
              {featured.map(b => <BookCard key={b.id} book={b} />)}
            </div>
          )}
        </div>

        {/* Newest */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
            <div>
              <h2 className="section-title">🆕 Recently Added</h2>
              <p className="section-subtitle">Fresh additions to our library</p>
            </div>
            <Link to="/books" style={{ color: '#c8860a', fontWeight: 700, fontSize: 14 }}>View all →</Link>
          </div>
          {loading ? <div className="spinner" /> : (
            <div style={grid}>
              {newest.map(b => <BookCard key={b.id} book={b} />)}
            </div>
          )}
        </div>

        {/* CTA banner */}
        <div style={cta.wrap}>
          <h2 style={cta.title}>Ready to share your literary journey?</h2>
          <p style={cta.text}>Join thousands of readers who write reviews, discover new books, and connect over their shared love of reading.</p>
          <Link to="/register" style={cta.btn}>Get Started — It's Free</Link>
        </div>
      </div>
    </div>
  );
}

const hero = {
  wrap: {
    background: 'linear-gradient(135deg, #1a0a00 0%, #3d2314 50%, #5c3520 100%)',
    minHeight: 500,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '60px 24px',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(200,134,10,0.15) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  content: {
    maxWidth: 1200,
    margin: '0 auto',
    width: '100%',
    position: 'relative',
    zIndex: 1,
    flex: 1,
  },
  eyebrow: {
    color: '#e6a012',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(40px, 6vw, 72px)',
    fontWeight: 700,
    color: 'white',
    lineHeight: 1.1,
    marginBottom: 20,
  },
  sub: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.7,
    maxWidth: 480,
    marginBottom: 36,
  },
  ctas: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  ctaPrimary: {
    background: '#c8860a',
    color: 'white',
    padding: '14px 32px',
    borderRadius: 4,
    fontWeight: 700,
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textDecoration: 'none',
  },
  ctaSecondary: {
    background: 'transparent',
    color: 'rgba(255,255,255,0.8)',
    padding: '14px 32px',
    borderRadius: 4,
    fontWeight: 700,
    fontSize: 15,
    border: '2px solid rgba(255,255,255,0.3)',
    textDecoration: 'none',
  },
  bookStack: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: -8,
    paddingRight: 60,
    position: 'relative',
  },
  bookEmoji: { fontSize: 64, lineHeight: 1, position: 'relative' },
};

const stats = {
  bar: { background: '#c8860a', padding: '20px 24px' },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 24,
  },
  item: { display: 'flex', alignItems: 'center', gap: 12 },
  icon: { fontSize: 28 },
  val: { fontSize: 22, fontWeight: 700, color: 'white' },
  lbl: { fontSize: 12, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 0.5 },
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: 20,
};

const cta = {
  wrap: {
    marginTop: 80,
    background: 'linear-gradient(135deg, #1a0a00, #3d2314)',
    borderRadius: 12,
    padding: '60px 48px',
    textAlign: 'center',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    fontWeight: 700,
    color: 'white',
    marginBottom: 16,
  },
  text: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' },
  btn: {
    display: 'inline-block',
    background: '#c8860a',
    color: 'white',
    padding: '14px 40px',
    borderRadius: 4,
    fontWeight: 700,
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textDecoration: 'none',
  },
};