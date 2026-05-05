import React from 'react';
import { Link } from 'react-router-dom';

const PLACEHOLDER = 'https://via.placeholder.com/160x240/3d2314/fdf6e8?text=No+Cover';

export default function BookCard({ book }) {
  const rating = book.averageRating;
  const stars = rating ? '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating)) : '☆☆☆☆☆';

  return (
    <Link to={`/books/${book.id}`} style={styles.link}>
      <div style={styles.card}>
        <div style={styles.coverWrap}>
          <img
            src={book.coverUrl || PLACEHOLDER}
            alt={book.title}
            style={styles.cover}
            onError={e => { e.target.src = PLACEHOLDER; }}
          />
          {book.genre && (
            <span style={styles.genre}>{book.genre}</span>
          )}
        </div>
        <div style={styles.body}>
          <h3 style={styles.title}>{book.title}</h3>
          <p style={styles.author}>by {book.author}</p>
          <div style={styles.meta}>
            {rating ? (
              <>
                <span style={styles.stars}>{stars}</span>
                <span style={styles.ratingNum}>{rating.toFixed(1)}</span>
                <span style={styles.count}>({book.reviewCount})</span>
              </>
            ) : (
              <span style={styles.noRating}>No reviews yet</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  link: { textDecoration: 'none', display: 'block' },
  card: {
    background: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(26,10,0,0.12)',
    transition: 'all 0.2s',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  coverWrap: {
    position: 'relative',
    paddingTop: '140%',
    background: '#f5ead4',
    overflow: 'hidden',
  },
  cover: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  genre: {
    position: 'absolute',
    top: 8, left: 8,
    background: 'rgba(200,134,10,0.9)',
    color: 'white',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  body: { padding: '12px 14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 15,
    fontWeight: 700,
    color: '#1a0a00',
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  author: { fontSize: 13, color: '#8b3a1c', fontWeight: 600, marginTop: 2 },
  meta: { marginTop: 'auto', paddingTop: 8, display: 'flex', alignItems: 'center', gap: 4 },
  stars: { color: '#d4a520', fontSize: 13, letterSpacing: '-1px' },
  ratingNum: { fontSize: 13, fontWeight: 700, color: '#1a0a00' },
  count: { fontSize: 12, color: '#888' },
  noRating: { fontSize: 12, color: '#aaa', fontStyle: 'italic' },
};