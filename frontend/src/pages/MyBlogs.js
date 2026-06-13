import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './MyBlogs.css';

const MyBlogs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const { data } = await api.get('/blogs/my');
        setBlogs(data);
      } catch {
        setError('Failed to load your blogs.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch {
      setError('Failed to delete blog.');
    }
  };

  return (
    <div className="my-blogs-page">
      <div className="container">
        <div className="my-blogs-header">
          <div>
            <h1>My Stories</h1>
            <div className="gold-divider" />
            <p>Welcome back, <strong>{user?.name}</strong>. Here are all your published blogs.</p>
          </div>
          <Link to="/create" className="btn btn-primary">+ Write New Blog</Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : blogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✍️</div>
            <h3>No blogs yet</h3>
            <p>You haven't published any blogs. Start writing your first story!</p>
            <Link to="/create" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Write Your First Blog
            </Link>
          </div>
        ) : (
          <div className="my-blogs-list">
            {blogs.map(blog => (
              <div key={blog._id} className="my-blog-item card">
                <div className="my-blog-info">
                  <div className="my-blog-badges">
                    <span className="badge badge-crimson">{blog.category}</span>
                    {blog.summary && <span className="badge badge-gold">✦ Summarized</span>}
                  </div>
                  <h3 onClick={() => navigate(`/blog/${blog._id}`)}>{blog.title}</h3>
                  <p className="my-blog-preview">
                    {(blog.summary || blog.content).substring(0, 160)}...
                  </p>
                  <div className="my-blog-meta">
                    <span>📅 {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>⏱ {blog.readTime} min read</span>
                    {blog.tags?.length > 0 && (
                      <span className="my-blog-tags">
                        {blog.tags.slice(0, 3).map(t => <span key={t} className="tag">#{t}</span>)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="my-blog-actions">
                  <Link to={`/blog/${blog._id}`} className="btn btn-ghost btn-sm">View</Link>
                  <Link to={`/edit/${blog._id}`} className="btn btn-outline btn-sm">Edit</Link>
                  <button onClick={() => handleDelete(blog._id)} className="btn btn-danger btn-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
