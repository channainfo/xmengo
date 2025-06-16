import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      // Disable navigation for now
      navigate('/home');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <motion.h2
        className="mb-6 text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Sign in to your account
      </motion.h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-300"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block px-3 py-2 w-full placeholder-gray-400 rounded-md border border-gray-300 shadow-sm appearance-none dark:border-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block px-3 py-2 w-full placeholder-gray-400 rounded-md border border-gray-300 shadow-sm appearance-none dark:border-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
            />
            <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <motion.button
            type="submit"
            disabled={isLoading}
            className="flex justify-center px-4 py-2 w-full text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-md border border-transparent shadow-sm transition-all duration-300 hover:from-pink-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:from-pink-600 dark:to-orange-600 dark:hover:from-pink-500 dark:hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <svg className="mr-2 -ml-1 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            Sign in
          </motion.button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="flex absolute inset-0 items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="flex relative justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div>
            <a
              href="#"
              className="inline-flex justify-center px-4 py-2 w-full text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Sign in with Google</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
            </a>
          </div>

          <div>
            <a
              href="#"
              className="inline-flex justify-center px-4 py-2 w-full text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Sign in with Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
