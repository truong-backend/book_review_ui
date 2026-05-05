import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { booksAPI } from '../api';

const GENRES = ['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy', 'Romance', 'Thriller', 'Biography', 'History', 'Self-Help', 'Science', 'Philosophy', 'Poetry', 'Children', 'Young Adult', 'Horror', 'Adventure', 'Comedy'];

export default function BookFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', author: '', description: '', coverUrl: '',
    genre: '', isbn: '', publishedYear: '', publisher: '', pageCount: '', language: 'English',
  });

  useEffect(() => {
    if (isEdit) {
      booksAPI.getById(id).then(r => {
        const b = r.data;
        setForm({
          title: b.title || '', author: b.author || '', description: b.description || '',
          coverUrl: b.coverUrl || '', genre: b.genre || '', isbn: b.isbn || '',
          publishedYear: b.publishedYear || '', publisher: b.publisher || '',
          pageCount: b.pageCount || '', language: b.language || 'English',
        });
      });
    }
  }, [id, isEdit]);

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      setError('Title and Author are required'); return;
    }
    setLoading(true); setError('');
    try {
      const data = {
        ...form,
        publishedYear: form.publishedYear ? parseInt(form.publishedYear) : null,
        pageCount: form.pageCount ? parseInt(form.pageCount) : null,
      };
      if (isEdit) {
        await booksAPI.update(id, data);
        navigate(`/books/${id}`);
      } else {
        const res = await booksAPI.create(data);
        navigate(`/books/${res.data.id}`);
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to save book');
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 700 }}>
      <h1 className="section-title">{isEdit ? 'Edit Book' : 'Add a New Book'}</h1>
      <p className="section-subtitle">{isEdit ? 'Update book information' : 'Share a book with the community'}</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={card}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Title *</label>
              <input className="form-input" value={form.title} onChange={set('title')} placeholder="Book title" required />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Author *</label>
              <input className="form-input" value={form.author} onChange={set('author')} placeholder="Author name" required />
            </div>
            <div className="form-group">
              <label className="form-label">Genre</label>
              <select className="form-input" value={form.genre} onChange={set('genre')}>
                <option value="">Select genre</option>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Published Year</label>
              <input className="form-input" type="number" value={form.publishedYear} onChange={set('publishedYear')} placeholder="e.g. 2023" min="1000" max="2030" />
            </div>
            <div className="form-group">
              <label className="form-label">Publisher</label>
              <input className="form-input" value={form.publisher} onChange={set('publisher')} placeholder="Publisher name" />
            </div>
            <div className="form-group">
              <label className="form-label">Pages</label>
              <input className="form-input" type="number" value={form.pageCount} onChange={set('pageCount')} placeholder="Number of pages" min="1" />
            </div>
            <div className="form-group">
              <label className="form-label">ISBN</label>
              <input className="form-input" value={form.isbn} onChange={set('isbn')} placeholder="ISBN number" />
            </div>
            <div className="form-group">
              <label className="form-label">Language</label>
              <input className="form-input" value={form.language} onChange={set('language')} placeholder="e.g. English" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Cover Image URL</label>
              <input className="form-input" value={form.coverUrl} onChange={set('coverUrl')} placeholder="https://..." type="url" />
              {form.coverUrl && (
                <img src={form.coverUrl} alt="Preview" style={{ width: 80, height: 120, objectFit: 'cover', borderRadius: 4, marginTop: 8 }} />
              )}
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description</label>
              <textarea className="form-input" value={form.description} onChange={set('description')} placeholder="Brief description of the book..." rows={5} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Book' : 'Add Book'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const card = {
  background: 'white',
  borderRadius: 8,
  padding: 32,
  boxShadow: '0 2px 12px rgba(26,10,0,0.08)',
};