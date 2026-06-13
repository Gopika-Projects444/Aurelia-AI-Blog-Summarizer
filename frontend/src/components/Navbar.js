import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">
            Aurelia<span className="logo-accent">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          {user && (
            <>
              <Link to="/create" className={`nav-link ${isActive('/create') ? 'active' : ''}`}>Write</Link>
              <Link to="/my-blogs" className={`nav-link ${isActive('/my-blogs') ? 'active' : ''}`}>My Blogs</Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">
                <span className="user-avatar">{user.name[0].toUpperCase()}</span>
                <span className="hide-mobile">{user.name}</span>
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          {user && (
            <>
              <Link to="/create" onClick={() => setMenuOpen(false)}>Write Blog</Link>
              <Link to="/my-blogs" onClick={() => setMenuOpen(false)}>My Blogs</Link>
            </>
          )}
          {user ? (
            <button onClick={handleLogout} className="mobile-logout">Logout</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
