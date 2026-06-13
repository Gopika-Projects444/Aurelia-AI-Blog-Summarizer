import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-glow" aria-hidden="true" />

      <div className="container footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">✦</span>
            <span className="footer-logo-text">
              Aurelia<span className="footer-logo-accent">AI</span>
            </span>
          </div>
          <p className="footer-tagline">
            Where words meet intelligence.<br />
            Write, summarize, and inspire.
          </p>
          <div className="footer-divider" />
          <p className="footer-copy">© {year} Aurelia AI-Blog Summarizer. All rights reserved.</p>
        </div>

        {/* Navigation */}
        <div className="footer-nav-group">
          <h4 className="footer-nav-title">Explore</h4>
          <ul className="footer-nav-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/create">Write a Blog</Link></li>
            <li><Link to="/my-blogs">My Stories</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div className="footer-nav-group">
          <h4 className="footer-nav-title">Account</h4>
          <ul className="footer-nav-list">
            <li><Link to="/signup">Create Account</Link></li>
            <li><Link to="/login">Sign In</Link></li>
          </ul>
        </div>

        {/* Features */}
        <div className="footer-nav-group">
          <h4 className="footer-nav-title">Features</h4>
          <ul className="footer-nav-list">
            <li><span>✦ AI Summarization</span></li>
            <li><span>🔍 Smart Search</span></li>
            <li><span>🔐 Secure Auth</span></li>
            <li><span>📱 Responsive Design</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>Built with <span className="heart">♥</span> using the MERN Stack</p>
          <div className="footer-tech-badges">
            <span className="tech-badge">MongoDB</span>
            <span className="tech-badge">Express</span>
            <span className="tech-badge">React</span>
            <span className="tech-badge">Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
