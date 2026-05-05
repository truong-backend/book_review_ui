import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { booksAPI, reviewsAPI } from '../api';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../Context/AuthContext';

const PLACEHOLDER = 'https://via.placeholder.com/280x420/3d2314/fdf6e8?text=No+Cover';

export default function BookDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', content: '' });
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    Promise.all([
      booksAPI.getById(id),
      reviewsAPI.getByBook(id, { page: 0, size: 10 }),
    ]).then(([bookRes, revRes]) => {
      setBook(bookRes.data);
      setReviews(revRes.data.content || []);
      setTotalPages(revRes.data.totalPages || 0);
    }).catch(() => navigate('/books'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const loadMoreReviews = async () => {
    const next = page + 1;
    const res = await reviewsAPI.getByBook(id, { page: next, size: 10 });
    setReviews(prev => [...prev, ...(res.data.content || [])]);
    setPage(next);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) { setError('Please select a rating'); return; }
    if (!reviewForm.title.trim()) { setError('Please add a title'); return; }
    if (!reviewForm.content.trim()) { setError('Please write your review'); return; }
    setReviewLoading(true); setError('');
    try {
      const res = await reviewsAPI.create(id, reviewForm);
      setReviews(prev => [res.data, ...prev]);
      setShowReviewForm(false);
      setReviewForm({ rating: 0, title: '', content: '' });
      const bookRes = await booksAPI.getById(id);
      setBook(bookRes.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to submit review');
    }
    setReviewLoading(false);
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const handleDeleteBook = async () => {
    if (window.confirm('Delete this book and all its reviews?')) {
      await booksAPI.delete(id);
      navigate('/books');
    }
  };

  if (loading) return <div style={{ padding: 60 }}><div className="spinner" /></div>;
  if (!book) return null;

  const stars = book.averageRating ? '★'.repeat(Math.round(book.averageRating)) + '☆'.repeat(5 - Math.round(book.averageRating)) : null;

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
        <Link to="/" style={{ color: '#c8860a' }}>Home</Link>
        {' / '}
        <Link to="/books" style={{ color: '#c8860a' }}>Books</Link>
        {' / '}
        {book.title}
      </div>

      {/* Book header */}
      <div style={detail.header}>
        <div style={detail.coverWrap}>
          <img
            src={book.coverUrl || PLACEHOLDER}
            alt={book.title}
            style={detail.cover}
            onError={e => { e.target.src = PLACEHOLDER; }}
          />
        </div>

        <div style={detail.info}>
          {book.genre && <span style={detail.genre}>{book.genre}</span>}
          <h1 style={detail.title}>{book.title}</h1>
          <p style={detail.author}>by <strong>{book.author}</strong></p>

          {book.averageRating && (
            <div style={detail.ratingRow}>
              <span style={detail.stars}>{stars}</span>
              <span style={detail.ratingNum}>{book.averageRating.toFixed(1)}</span>
              <span style={detail.ratingCount}>({book.reviewCount} reviews)</span>
            </div>
          )}

          <div style={detail.meta}>
            {book.publishedYear && <div style={detail.metaItem}><span style={detail.metaLabel}>Year</span><span>{book.publishedYear}</span></div>}
            {book.publisher && <div style={detail.metaItem}><span style={detail.metaLabel}>Publisher</span><span>{book.publisher}</span></div>}
            {book.pageCount && <div style={detail.metaItem}><span style={detail.metaLabel}>Pages</span><span>{book.pageCount}</span></div>}
            {book.language && <div style={detail.metaItem}><span style={detail.metaLabel}>Language</span><span>{book.language}</span></div>}
            {book.isbn && <div style={detail.metaItem}><span style={detail.metaLabel}>ISBN</span><span>{book.isbn}</span></div>}
          </div>

          {book.description && (
            <p style={detail.desc}>{book.description}</p>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            {user && (
              <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn btn-primary">
                {showReviewForm ? 'Cancel' : '✍️ Write a Review'}
              </button>
            )}
            {user && (
              <>
                <Link to={`/books/${id}/edit`} className="btn btn-outline">Edit</Link>
                <button onClick={handleDeleteBook} className="btn btn-danger">Delete</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Review form */}
      {showReviewForm && (
        <div style={form.wrap}>
          <h2 style={form.title}>Write Your Review</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Your Rating *</label>
              <StarRating value={reviewForm.rating} onChange={r => setReviewForm(p => ({ ...p, rating: r }))} size={32} />
            </div>
            <div className="form-group">
              <label className="form-label">Review Title *</label>
              <input
                className="form-input"
                value={reviewForm.title}
                onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Sum up your thoughts..."
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Your Review *</label>
              <textarea
                className="form-input"
                value={reviewForm.content}
                onChange={e => setReviewForm(p => ({ ...p, content: e.target.value }))}
                placeholder="Share your honest thoughts about this book..."
                rows={6}
              />
            </div>
            <div>
              <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews */}
      <div style={{ marginTop: 48 }}>
        <h2 className="section-title" style={{ marginBottom: 24 }}>
          Reader Reviews {book.reviewCount > 0 && `(${book.reviewCount})`}
        </h2>

        {reviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💭</div>
            <h3>No reviews yet</h3>
            <p>Be the first to share your thoughts!</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reviews.map(r => (
                <ReviewCard key={r.id} review={r} onDelete={handleDeleteReview} />
              ))}
            </div>
            {page + 1 < totalPages && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button onClick={loadMoreReviews} className="btn btn-outline">Load More Reviews</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const detail = {
  header: { display: 'flex', gap: 48, marginBottom: 48, flexWrap: 'wrap' },
  coverWrap: { flexShrink: 0, width: 240 },
  cover: { width: '100%', borderRadius: 6, boxShadow: '0 8px 32px rgba(26,10,0,0.25)' },
  info: { flex: 1, minWidth: 280 },
  genre: {
    display: 'inline-block',
    background: '#fef3d8',
    color: '#c8860a',
    fontSize: 12,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(24px, 4vw, 40px)',
    fontWeight: 700,
    color: '#1a0a00',
    lineHeight: 1.2,
    marginBottom: 8,
  },
  author: { fontSize: 18, color: '#8b3a1c', marginBottom: 16 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 },
  stars: { color: '#d4a520', fontSize: 22, letterSpacing: -1 },
  ratingNum: { fontSize: 24, fontWeight: 700, color: '#1a0a00' },
  ratingCount: { fontSize: 14, color: '#888' },
  meta: { display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 },
  metaItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  metaLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#888' },
  desc: { fontSize: 15, color: '#3d2314', lineHeight: 1.8, marginTop: 16, maxWidth: 600 },
};

const form = {
  wrap: {
    background: 'white',
    borderRadius: 8,
    padding: 32,
    boxShadow: '0 2px 12px rgba(26,10,0,0.08)',
    marginBottom: 32,
    border: '1px solid #f5ead4',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22,
    fontWeight: 700,
    color: '#1a0a00',
    marginBottom: 20,
  },
};