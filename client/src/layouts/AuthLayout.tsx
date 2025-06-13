import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const AuthLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-primary-600 dark:text-primary-400"
            >
              Fmengo
            </motion.div>
          </div>

          {/* Auth Form Container */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-xl sm:px-10"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Fmengo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
