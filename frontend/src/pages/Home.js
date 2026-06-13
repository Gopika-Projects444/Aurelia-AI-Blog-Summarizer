import React, { useState, useEffect, useCallback } from 'react';
import BlogCard from '../components/BlogCard';
import api from '../utils/api';
import './Home.css';

const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Other'];

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;

      const { data } = await api.get('/blogs', { params });
      setBlogs(data.blogs);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-ornament" aria-hidden="true">✦</div>
        <div className="hero-content">
          <p className="hero-eyebrow">AI-Powered Blogging Platform</p>
          <h1 className="hero-title">
            Where Words Meet<br />
            <span className="hero-accent">Intelligence</span>
          </h1>
          <p className="hero-subtitle">
            Discover insightful blogs, generate AI summaries in one click,<br className="hide-mobile" />
            and share your stories with the world.
          </p>
        </div>
        <div className="hero-deco" aria-hidden="true" />
      </section>

      {/* Search & Filter */}
      <div className="container">
        <div className="search-section">
          <form className="search-bar" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search blogs by title, content, or tags..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button type="button" className="search-clear" onClick={clearSearch}>✕</button>
            )}
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <div className="category-filters">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-btn ${category === cat ? 'active' : ''}`}
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="results-header">
          <div>
            <h2 className="results-title">
              {search ? `Results for "${search}"` : category !== 'All' ? category : 'Latest Stories'}
            </h2>
            <p className="results-count">{total} {total === 1 ? 'post' : 'posts'} found</p>
          </div>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : blogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No blogs found</h3>
            <p>
              {search ? `No results for "${search}". Try a different keyword.` : 'Be the first to write a blog!'}
            </p>
            {search && (
              <button onClick={clearSearch} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="blog-grid">
              {blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-ghost"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                >
                  ← Previous
                </button>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-ghost"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
