import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  UserIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import FmengoLogo from '../components/ui/FmengoLogo';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount } = useNotifications();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/', icon: <HomeIcon className="w-6 h-6" />, label: 'Home' },
    { path: '/matches', icon: <HeartIcon className="w-6 h-6" />, label: 'Matches' },
    { path: '/messages', icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, label: 'Messages' },
    { path: '/profile', icon: <UserIcon className="w-6 h-6" />, label: 'Profile' },
    { path: '/safety', icon: <ShieldCheckIcon className="w-6 h-6" />, label: 'Safety' },
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showMoreMenu) setShowMoreMenu(false);
  };

  const toggleMoreMenu = () => {
    setShowMoreMenu(!showMoreMenu);
    if (showNotifications) setShowNotifications(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Header - Sticky */}
      <header className="flex sticky top-0 z-50 justify-between items-center px-6 py-4 bg-white shadow dark:bg-gray-800">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <FmengoLogo size="md" className="transition-transform hover:scale-105" />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Main Navigation Links - Hidden on small screens */}
          <div className="hidden items-center mr-4 space-x-6 sm:flex">
            <Link
              to="/matches"
              className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 ${location.pathname === '/matches' ? 'text-primary-600 dark:text-primary-400 font-medium' : ''}`}
            >
              Matches
            </Link>
            <Link
              to="/messages"
              className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 ${location.pathname === '/messages' ? 'text-primary-600 dark:text-primary-400 font-medium' : ''}`}
            >
              Messages
            </Link>
            <Link
              to="/safety"
              className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 ${location.pathname === '/safety' ? 'text-primary-600 dark:text-primary-400 font-medium' : ''}`}
            >
              <ShieldCheckIcon className="mr-1 w-5 h-5" />
              Safety
            </Link>
          </div>

          {/* More Menu - Hidden on small screens */}
          <div className="hidden relative sm:block" ref={moreMenuRef}>
            <button
              onClick={toggleMoreMenu}
              className="flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <InformationCircleIcon className="mr-1 w-5 h-5" />
              <span className="hidden text-sm md:inline">More</span>
              <ChevronDownIcon className="ml-1 w-4 h-4" />
            </button>

            {/* More Dropdown */}
            {showMoreMenu && (
              <div className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-md shadow-lg dark:bg-gray-800">
                <div className="py-1">
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowMoreMenu(false)}
                  >
                    <div className="flex items-center">
                      <Cog6ToothIcon className="mr-2 w-4 h-4" />
                      Settings
                    </div>
                  </Link>
                  <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>
                  <Link
                    to="/terms"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowMoreMenu(false)}
                  >
                    Terms of Service
                  </Link>
                  <Link
                    to="/privacy"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowMoreMenu(false)}
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowMoreMenu(false)}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            )}
          </div>

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
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="inline-flex absolute top-0 right-0 justify-center items-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="overflow-y-auto absolute right-0 z-50 mt-2 w-80 max-h-96 bg-white rounded-md shadow-lg dark:bg-gray-800">
                <div className="p-4 border-b dark:border-gray-700">
                  <h3 className="text-lg font-medium">Notifications</h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                      >
                        <p className="text-sm">{notification.content}</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
            <div className="overflow-hidden w-8 h-8 bg-gray-300 rounded-full dark:bg-gray-600">
              {user?.photos?.find(p => p.isMain)?.url ? (
                <img
                  src={user.photos.find(p => p.isMain)?.url}
                  alt={user.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex justify-center items-center w-full h-full text-gray-600 dark:text-gray-300">
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
          className="container px-4 py-6 mx-auto max-w-6xl sm:py-8"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile Navigation - Sticky Bottom */}
      <nav className="sm:hidden mobile-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${location.pathname === item.path ? 'text-primary-600 dark:text-primary-400' : ''
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
