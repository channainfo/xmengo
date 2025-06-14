import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import FmengoLogo from '../components/ui/FmengoLogo';

const AuthLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full backdrop-blur-sm transition-colors bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <div className="flex flex-col flex-grow justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center">
              <FmengoLogo size="lg" className="transition-transform hover:scale-105" />
            </Link>
          </div>

          {/* Auth Form Container */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="px-6 py-8 bg-white rounded-xl shadow-xl dark:bg-gray-800 sm:px-10"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-sm text-center text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Fmengo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
