import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI, reviewsAPI } from '../api';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../Context/AuthContext';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);

  const isOwn = currentUser && currentUser.id === parseInt(id);

  useEffect(() => {
    Promise.all([
      usersAPI.getById(id),
      reviewsAPI.getByUser(id, { page: 0, size: 20 }),
    ]).then(([u, r]) => {
      setProfile(u.data);
      setReviews(r.data.content || []);
      setEditForm({ fullName: u.data.fullName || '', bio: u.data.bio || '', avatarUrl: u.data.avatarUrl || '' });
    }).catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await usersAPI.updateProfile(editForm);
      setProfile(res.data);
      setEditing(false);
      refreshUser();
    } catch {}
    setSaveLoading(false);
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  if (loading) return <div style={{ padding: 60 }}><div className="spinner" /></div>;
  if (!profile) return null;

  const joinDate = new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
      {/* Profile header */}
      <div style={prof.header}>
        <div style={prof.avatarWrap}>
          {profile.avatarUrl
            ? <img src={profile.avatarUrl} alt="" style={prof.avatarImg} />
            : <div style={prof.avatarFallback}>{profile.username?.[0]?.toUpperCase()}</div>
          }
        </div>
        <div style={prof.info}>
          <h1 style={prof.name}>{profile.fullName || profile.username}</h1>
          {profile.fullName && <p style={prof.username}>@{profile.username}</p>}
          <p style={prof.joinDate}>Member since {joinDate}</p>
          {profile.bio && <p style={prof.bio}>{profile.bio}</p>}
          <div style={prof.stats}>
            <div style={prof.stat}>
              <span style={prof.statNum}>{reviews.length}</span>
              <span style={prof.statLabel}>Reviews</span>
            </div>
          </div>
          {isOwn && !editing && (
            <button onClick={() => setEditing(true)} className="btn btn-outline" style={{ marginTop: 16 }}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div style={editCard}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 20 }}>Edit Profile</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={editForm.fullName} onChange={e => setEditForm(p => ({ ...p, fullName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Avatar URL</label>
              <input className="form-input" value={editForm.avatarUrl} onChange={e => setEditForm(p => ({ ...p, avatarUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-input" value={editForm.bio} onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))} rows={3} placeholder="Tell us about yourself..." />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary" disabled={saveLoading}>{saveLoading ? 'Saving...' : 'Save Changes'}</button>
              <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <hr className="divider" />

      {/* Reviews */}
      <h2 className="section-title" style={{ marginBottom: 24 }}>
        {isOwn ? 'My Reviews' : `Reviews by ${profile.username}`}
      </h2>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No reviews yet</h3>
          <p>{isOwn ? 'Start reviewing books you\'ve read!' : 'This user hasn\'t reviewed any books yet.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviews.map(r => (
            <ReviewCard key={r.id} review={r} onDelete={handleDeleteReview} showBook />
          ))}
        </div>
      )}
    </div>
  );
}

const prof = {
  header: { display: 'flex', gap: 32, marginBottom: 32, alignItems: 'flex-start', flexWrap: 'wrap' },
  avatarWrap: { flexShrink: 0 },
  avatarImg: { width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid #c8860a' },
  avatarFallback: {
    width: 120, height: 120,
    borderRadius: '50%',
    background: '#1a0a00',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    fontWeight: 700,
    color: '#e6a012',
    border: '4px solid #c8860a',
  },
  info: { flex: 1 },
  name: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#1a0a00', marginBottom: 4 },
  username: { fontSize: 16, color: '#c8860a', fontWeight: 600, marginBottom: 4 },
  joinDate: { fontSize: 13, color: '#888', marginBottom: 12 },
  bio: { fontSize: 15, color: '#3d2314', lineHeight: 1.7, maxWidth: 500, marginBottom: 12 },
  stats: { display: 'flex', gap: 24 },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: 700, color: '#1a0a00' },
  statLabel: { fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
};

const editCard = {
  background: 'white',
  borderRadius: 8,
  padding: 28,
  marginBottom: 32,
  boxShadow: '0 2px 12px rgba(26,10,0,0.08)',
  border: '1px solid #f5ead4',
};