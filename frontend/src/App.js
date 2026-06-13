import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import BlogDetail from './pages/BlogDetail';
import MyBlogs from './pages/MyBlogs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/blog/:id" element={<BlogDetail />} />

            <Route path="/create" element={
              <ProtectedRoute><CreateBlog /></ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute><EditBlog /></ProtectedRoute>
            } />
            <Route path="/my-blogs" element={
              <ProtectedRoute><MyBlogs /></ProtectedRoute>
            } />
          </Routes>
          <Footer />
        </div>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          theme="light"
          toastStyle={{ borderLeft: '4px solid #8B0000' }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
