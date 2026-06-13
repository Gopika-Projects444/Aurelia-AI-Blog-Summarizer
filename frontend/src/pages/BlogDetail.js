import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/blogs/${id}`);
        setBlog(data);
      } catch {
        setError('Blog not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    setDeleting(true);
    try {
      await api.delete(`/blogs/${id}`);
      navigate('/my-blogs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (error) return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h2>{error}</h2>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</Link>
    </div>
  );

  const isOwner = user && blog.author?._id === user._id;
  const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="blog-detail-page">
      <div className="container">
        <div className="blog-detail-layout">
          {/* Main Content */}
          <main className="blog-detail-main">
            {/* Back */}
            <Link to="/" className="back-link">← Back to Blogs</Link>

            {/* Header */}
            <header className="blog-detail-header card">
              <div className="blog-badges">
                <span className="badge badge-crimson">{blog.category}</span>
                {blog.summary && <span className="badge badge-gold">✦ AI Summary Available</span>}
              </div>

              <h1 className="blog-detail-title">{blog.title}</h1>
              <div className="gold-divider" style={{ marginBottom: '1rem' }} />

              <div className="blog-detail-meta">
                <div className="author-info">
                  <span className="author-avatar-lg">{blog.authorName?.[0]?.toUpperCase()}</span>
                  <div>
                    <p className="author-name">{blog.authorName}</p>
                    <p className="blog-date">{date}</p>
                  </div>
                </div>
                <div className="blog-stats">
                  <span>⏱ {blog.readTime} min read</span>
                </div>
              </div>

              {isOwner && (
                <div className="owner-actions">
                  <Link to={`/edit/${blog._id}`} className="btn btn-outline btn-sm">✏️ Edit</Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="btn btn-danger btn-sm"
                  >
                    {deleting ? 'Deleting...' : '🗑 Delete'}
                  </button>
                </div>
              )}
            </header>

            {/* AI Summary Toggle */}
            {blog.summary && (
              <div className={`summary-banner ${showSummary ? 'open' : ''}`}>
                <div className="summary-banner-header" onClick={() => setShowSummary(!showSummary)}>
                  <div className="summary-banner-title">
                    <span className="summary-gold-icon">✦</span>
                    <div>
                      <strong>AI-Generated Summary</strong>
                      <p>Click to {showSummary ? 'hide' : 'show'} the concise summary</p>
                    </div>
                  </div>
                  <span className="summary-toggle-icon">{showSummary ? '▲' : '▼'}</span>
                </div>
                {showSummary && (
                  <div className="summary-content">
                    <p>{blog.summary}</p>
                  </div>
                )}
              </div>
            )}

            {/* Blog Content */}
            <article className="blog-content card">
              {blog.content.split('\n').map((para, i) =>
                para.trim() ? <p key={i}>{para}</p> : <br key={i} />
              )}
            </article>

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="blog-tags">
                <strong>Tags:</strong>
                {blog.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            <div className="card sidebar-card">
              <h4>About the Author</h4>
              <div className="gold-divider" />
              <div className="sidebar-author">
                <span className="author-avatar-lg">{blog.authorName?.[0]?.toUpperCase()}</span>
                <p className="author-name">{blog.authorName}</p>
              </div>
            </div>

            {blog.summary && (
              <div className="card sidebar-card summary-sidebar">
                <h4>✦ Quick Summary</h4>
                <div className="gold-divider" />
                <p className="sidebar-summary-text">{blog.summary}</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
