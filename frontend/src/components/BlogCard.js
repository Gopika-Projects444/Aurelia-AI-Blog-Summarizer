import React from 'react';
import { Link } from 'react-router-dom';
import './BlogCard.css';

const BlogCard = ({ blog }) => {
  const { _id, title, summary, content, category, authorName, readTime, createdAt, tags } = blog;

  const preview = summary || content?.substring(0, 160) + '...';
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <Link to={`/blog/${_id}`} className="blog-card-link">
      <article className="blog-card card">
        <div className="blog-card-header">
          <span className="badge badge-crimson">{category}</span>
          {summary && <span className="badge badge-gold ai-badge">✦ AI Summary</span>}
        </div>

        <h3 className="blog-card-title">{title}</h3>
        <div className="gold-divider" />
        <p className="blog-card-preview">{preview}</p>

        {tags?.length > 0 && (
          <div className="blog-card-tags">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="blog-card-footer">
          <div className="blog-meta">
            <span className="author-chip">{authorName?.[0]?.toUpperCase()}</span>
            <div>
              <p className="author-name">{authorName}</p>
              <p className="blog-date">{date}</p>
            </div>
          </div>
          <span className="read-time">⏱ {readTime} min</span>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
