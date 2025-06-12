import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppSelector } from './store';

// Pages
import LandingPage from './pages/LandingPage';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const App: React.FC = () => {
  const { mode } = useAppSelector((state) => state.theme);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Apply theme mode to HTML element
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={!isAuthenticated ? <LandingPage /> : <Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="matches" element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          } />
        </Route>
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
