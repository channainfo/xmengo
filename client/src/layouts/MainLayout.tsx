import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  UserIcon, 
  HeartIcon, 
  ChatBubbleLeftRightIcon, 
  Cog6ToothIcon, 
  BellIcon, 
  MoonIcon, 
  SunIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount } = useNotifications();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { path: '/', icon: <HomeIcon className="w-6 h-6" />, label: 'Home' },
    { path: '/profile', icon: <UserIcon className="w-6 h-6" />, label: 'Profile' },
    { path: '/matches', icon: <HeartIcon className="w-6 h-6" />, label: 'Matches' },
    { path: '/messages', icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, label: 'Messages' },
    { path: '/settings', icon: <Cog6ToothIcon className="w-6 h-6" />, label: 'Settings' },
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Header */}
      <header className="hidden sm:flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Fmengo
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={toggleNotifications}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            >
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b dark:border-gray-700">
                  <h3 className="text-lg font-medium">Notifications</h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <p className="text-sm">{notification.content}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-2 text-center border-t dark:border-gray-700">
                    <Link 
                      to="/notifications" 
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* User Profile */}
          <Link to="/profile" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
              {user?.photos?.find(p => p.isMain)?.url ? (
                <img 
                  src={user.photos.find(p => p.isMain)?.url} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl"
        >
          <Outlet />
        </motion.div>
      </main>
      
      {/* Mobile Navigation */}
      <nav className="sm:hidden mobile-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${
              location.pathname === item.path ? 'text-primary-600 dark:text-primary-400' : ''
            }`}
          >
            <div className="mobile-nav-icon">{item.icon}</div>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MainLayout;
