import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const NotFound: React.FC = () => {
  const { mode } = useSelector((state: RootState) => state.theme);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="text-center">
        <h1 className="text-9xl font-bold text-purple-600">404</h1>
        <h2 className="text-4xl font-bold mt-4">Page Not Found</h2>
        <p className={`mt-4 text-lg ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium hover:from-purple-700 hover:to-pink-600 transition duration-300"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
