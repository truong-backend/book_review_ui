import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { reviewsAPI } from '../api';
import { useAuth } from '../Context/AuthContext';

export default function ReviewCard({ review, onDelete, showBook = false }) {
  const { user } = useAuth();
  const isOwner = user && user.id === review.userId;

  const handleLike = async () => {
    try { await reviewsAPI.like(review.id); } catch {}
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this review?')) {
      try {
        await reviewsAPI.delete(review.id);
        if (onDelete) onDelete(review.id);
      } catch (e) { alert('Failed to delete review'); }
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div style={styles.card}>
      {showBook && review.bookTitle && (
        <Link to={`/books/${review.bookId}`} style={styles.bookLink}>
          <div style={styles.bookRef}>
            {review.bookCoverUrl && (
              <img src={review.bookCoverUrl} alt="" style={styles.bookThumb} />
            )}
            <span>{review.bookTitle}</span>
          </div>
        </Link>
      )}
      <div style={styles.header}>
        <div style={styles.reviewer}>
          <div style={styles.avatar}>
            {review.userAvatarUrl
              ? <img src={review.userAvatarUrl} alt="" style={styles.avatarImg} />
              : <span style={styles.avatarLetter}>{review.username?.[0]?.toUpperCase()}</span>
            }
          </div>
          <div>
            <div style={styles.username}>{review.username}</div>
            <div style={styles.date}>{formatDate(review.createdAt)}</div>
          </div>
        </div>
        <StarRating value={review.rating} readOnly size={18} />
      </div>
      <h4 style={styles.title}>{review.title}</h4>
      <p style={styles.content}>{review.content}</p>
      <div style={styles.footer}>
        <button onClick={handleLike} style={styles.likeBtn}>
          ♥ {review.likes}
        </button>
        {isOwner && (
          <button onClick={handleDelete} style={styles.deleteBtn}>Delete</button>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: 8,
    padding: 20,
    boxShadow: '0 1px 4px rgba(26,10,0,0.08)',
    borderLeft: '4px solid #c8860a',
  },
  bookRef: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#c8860a',
    fontWeight: 700,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: '1px solid #f5ead4',
  },
  bookLink: { textDecoration: 'none' },
  bookThumb: { width: 32, height: 48, objectFit: 'cover', borderRadius: 2 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  reviewer: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: {
    width: 40, height: 40,
    borderRadius: '50%',
    background: '#3d2314',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarLetter: { color: '#e6a012', fontWeight: 700, fontSize: 16 },
  username: { fontWeight: 700, fontSize: 14, color: '#1a0a00' },
  date: { fontSize: 12, color: '#888' },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 17,
    fontWeight: 700,
    color: '#1a0a00',
    marginBottom: 8,
  },
  content: { fontSize: 15, color: '#3d2314', lineHeight: 1.7 },
  footer: { marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 },
  likeBtn: {
    background: 'none',
    border: '1px solid #f5ead4',
    color: '#c8860a',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 13,
    cursor: 'pointer',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#8b3a1c',
    fontSize: 13,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};