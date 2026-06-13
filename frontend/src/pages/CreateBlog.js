import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './BlogForm.css';

const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Other'];

const CreateBlog = () => {
  const [form, setForm] = useState({
    title: '', content: '', category: 'Other', tags: '', summary: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();

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
    } catch (err) {
      setServerError('Failed to generate summary. Please try again.');
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
      const { data } = await api.post('/blogs', { ...form, tags });
      navigate(`/blog/${data._id}`);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-form-page">
      <div className="container">
        <div className="blog-form-header">
          <h1>Write a New Story</h1>
          <div className="gold-divider" />
          <p>Share your ideas with the world. Use AI to summarize your content.</p>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form className="blog-form card" onSubmit={handleSubmit} noValidate>
          {/* Title */}
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

          {/* Category & Tags */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <select
                id="category" name="category"
                className="form-select"
                value={form.category} onChange={handleChange}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="tags">Tags <span className="label-hint">(comma-separated)</span></label>
              <input
                id="tags" name="tags" type="text"
                className="form-input"
                placeholder="react, ai, technology"
                value={form.tags} onChange={handleChange}
              />
            </div>
          </div>

          {/* Content */}
          <div className="form-group">
            <div className="label-row">
              <label className="form-label" htmlFor="content">Blog Content *</label>
              <span className="char-count">{form.content.length} characters</span>
            </div>
            <textarea
              id="content" name="content"
              className={`form-textarea content-area ${errors.content ? 'input-error' : ''}`}
              placeholder="Write your blog post here. The richer the content, the better the AI summary..."
              value={form.content} onChange={handleChange}
            />
            {errors.content && <span className="form-error">{errors.content}</span>}
          </div>

          {/* AI Summary */}
          <div className="summary-section">
            <div className="summary-header">
              <div>
                <h3>✦ AI Summary</h3>
                <p className="summary-desc">Generate a smart summary from your content</p>
              </div>
              <button
                type="button"
                className="btn btn-gold"
                onClick={handleSummarize}
                disabled={summarizing || form.content.length < 50}
              >
                {summarizing ? (
                  <><span className="btn-spinner-dark" />Generating...</>
                ) : (
                  <>✦ Generate Summary</>
                )}
              </button>
            </div>

            {form.summary ? (
              <div className="summary-result">
                <div className="summary-label">AI-Generated Summary</div>
                <textarea
                  name="summary"
                  className="form-textarea summary-area"
                  value={form.summary}
                  onChange={handleChange}
                  placeholder="AI summary will appear here. You can edit it."
                  rows={4}
                />
              </div>
            ) : (
              <div className="summary-placeholder">
                <span>Write your blog content and click "Generate Summary" to get an AI-powered summary</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="btn-spinner" />Publishing...</> : '📝 Publish Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
