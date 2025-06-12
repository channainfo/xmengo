import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { RootState } from '../store';
import { toggleTheme } from '../features/theme/themeSlice';
import { logout } from '../features/auth/authSlice';

const Navbar: React.FC = () => {
  const { mode } = useSelector((state: RootState) => state.theme);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            Fmengo
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-pink-200 transition duration-300">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-pink-200 transition duration-300">
                  Dashboard
                </Link>
                <Link to="/profile" className="hover:text-pink-200 transition duration-300">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/about" className="hover:text-pink-200 transition duration-300">
                  About
                </Link>
                <Link to="/features" className="hover:text-pink-200 transition duration-300">
                  Features
                </Link>
              </>
            )}
          </div>

          {/* Auth & Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-full hover:bg-purple-700 transition duration-300"
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="hidden md:inline">Hello, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-purple-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="bg-transparent border border-white text-white px-4 py-2 rounded-full font-medium hover:bg-white hover:text-purple-600 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-purple-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
