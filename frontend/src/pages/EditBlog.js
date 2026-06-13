import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import './BlogForm.css';

const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Other'];

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', category: 'Other', tags: '', summary: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/${id}`);
        setForm({
          title: data.title,
          content: data.content,
          category: data.category,
          tags: (data.tags || []).join(', '),
          summary: data.summary || ''
        });
      } catch {
        setServerError('Failed to load blog for editing.');
      } finally {
        setFetching(false);
      }
    };
    fetchBlog();
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!form.title || form.title.trim().length < 5) errs.title = 'Title must be at least 5 characters';
    if (!form.content || form.content.trim().length < 50) errs.content = 'Content must be at least 50 characters';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const handleSummarize = async () => {
    if (!form.content || form.content.trim().length < 50) {
      setErrors({ ...errors, content: 'Write at least 50 characters before summarizing' });
      return;
    }
    setSummarizing(true);
    try {
      const { data } = await api.post('/blogs/summarize', { content: form.content });
      setForm({ ...form, summary: data.summary });
    } catch {
      setServerError('Failed to generate summary.');
    } finally {
      setSummarizing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      await api.put(`/blogs/${id}`, { ...form, tags });
      navigate(`/blog/${id}`);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update blog');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="blog-form-page">
      <div className="container">
        <div className="blog-form-header">
          <h1>Edit Your Story</h1>
          <div className="gold-divider" />
          <p>Update your blog post content or regenerate the AI summary.</p>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form className="blog-form card" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Blog Title *</label>
            <input
              id="title" name="title" type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="Write a captivating title..."
              value={form.title} onChange={handleChange}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tags <span className="label-hint">(comma-separated)</span></label>
              <input name="tags" type="text" className="form-input"
                placeholder="react, ai, technology" value={form.tags} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label className="form-label">Blog Content *</label>
              <span className="char-count">{form.content.length} characters</span>
            </div>
            <textarea name="content"
              className={`form-textarea content-area ${errors.content ? 'input-error' : ''}`}
              value={form.content} onChange={handleChange} />
            {errors.content && <span className="form-error">{errors.content}</span>}
          </div>

          <div className="summary-section">
            <div className="summary-header">
              <div>
                <h3>✦ AI Summary</h3>
                <p className="summary-desc">Regenerate or edit the summary</p>
              </div>
              <button type="button" className="btn btn-gold"
                onClick={handleSummarize}
                disabled={summarizing || form.content.length < 50}>
                {summarizing ? <><span className="btn-spinner-dark" />Generating...</> : '✦ Regenerate'}
              </button>
            </div>
            <div className="summary-result">
              <div className="summary-label">Summary</div>
              <textarea name="summary" className="form-textarea summary-area"
                value={form.summary} onChange={handleChange}
                placeholder="Summary will appear here or type your own..." rows={4} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(`/blog/${id}`)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="btn-spinner" />Saving...</> : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
