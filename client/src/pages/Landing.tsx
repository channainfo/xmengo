import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MoonIcon, SunIcon, HeartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../contexts/ThemeContext';

const Landing: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [currentProfile, setCurrentProfile] = useState(0);
  
  // Sample profiles for the card stack
  const profiles = [
    {
      name: "Sarah, 28",
      bio: "Adventure seeker and coffee enthusiast",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
    },
    {
      name: "Michael, 32",
      bio: "Foodie and hiking enthusiast",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
    },
    {
      name: "Emma, 26",
      bio: "Book lover and yoga instructor",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
    }
  ];
  
  const handleSwipe = (_direction: 'left' | 'right') => {
    // Show a brief animation
    setTimeout(() => {
      setCurrentProfile((prev) => (prev + 1) % profiles.length);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white bg-opacity-10 backdrop-blur-sm dark:bg-black dark:bg-opacity-10 z-10 shadow-sm">
        <div className="flex items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <FireIcon className="h-8 w-8 text-pink-500 mr-2" />
            <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">Fmengo</span>
          </motion.div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          <Link 
            to="/login"
            className="px-4 py-2 text-sm font-medium text-pink-700 dark:text-pink-300 hover:text-pink-800 dark:hover:text-pink-200 transition-colors"
          >
            Sign In
          </Link>
          
          <Link 
            to="/register"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section with Card Stack */}
      <section className="flex-grow flex flex-col md:flex-row items-center justify-center px-6 py-12 md:py-20 max-w-7xl mx-auto">
        <motion.div 
          className="w-full md:w-1/2 mb-12 md:mb-0 md:pr-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Swipe <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">right</span> for love
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join millions finding meaningful connections every day.
            Fmengo matches you with people who share your interests and values.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link 
              to="/register" 
              className="px-8 py-3 text-center text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-full transition-all shadow-md hover:shadow-lg font-medium"
            >
              Create Account
            </Link>
            
            <Link 
              to="/login" 
              className="px-8 py-3 text-center text-pink-700 dark:text-pink-300 border border-pink-500 dark:border-pink-400 bg-white bg-opacity-50 dark:bg-white dark:bg-opacity-10 hover:bg-opacity-70 dark:hover:bg-opacity-20 rounded-full transition-all shadow-md hover:shadow-lg font-medium"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Tinder-style card stack */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative w-72 h-96">
            <AnimatePresence>
              <motion.div
                key={currentProfile}
                className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
                exit={{ 
                  opacity: 0, 
                  x: Math.random() > 0.5 ? 300 : -300, 
                  rotateZ: Math.random() > 0.5 ? 20 : -20 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <img 
                  src={profiles[currentProfile].image}
                  alt={profiles[currentProfile].name}
                  className="w-full h-3/4 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{profiles[currentProfile].name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{profiles[currentProfile].bio}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Swipe buttons */}
            <div className="absolute -bottom-16 left-0 w-full flex justify-center space-x-6 mt-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                onClick={() => handleSwipe('left')}
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-500 rounded-full shadow-lg"
                onClick={() => handleSwipe('right')}
              >
                <HeartIcon className="w-6 h-6 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-pink-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Why Everyone Loves Fmengo
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Matches",
                description: "Our AI algorithm learns your preferences and suggests compatible matches you'll actually like.",
                icon: "❤️"
              },
              {
                title: "Safe & Secure",
                description: "Verified profiles and advanced reporting systems ensure a respectful, safe dating experience.",
                icon: "🛡️"
              },
              {
                title: "Real Connections",
                description: "Join millions who've found meaningful relationships, not just casual encounters.",
                icon: "✨"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-pink-100 dark:border-pink-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Success Stories
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "I swiped right and found my forever. Two years later, we're engaged! Thank you Fmengo for bringing us together.",
                name: "Jessica & Mike",
                image: "https://images.unsplash.com/photo-1516554646385-7642248096d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
                since: "Matched in 2023"
              },
              {
                quote: "After countless dating apps, Fmengo was different. The matches were better, and I met someone who truly gets me.",
                name: "David T.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
                since: "Member since 2022"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <div className="w-full md:w-1/3">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 w-full md:w-2/3">
                  <p className="text-lg text-gray-700 dark:text-gray-300 italic mb-6">
                    "{testimonial.quote}"
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-pink-500 dark:text-pink-400">{testimonial.since}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-pink-100 to-orange-100 dark:from-pink-900 dark:from-opacity-30 dark:to-orange-900 dark:to-opacity-30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your perfect match is just a <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">swipe away</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-700 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join millions of singles finding love every day on Fmengo.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link 
              to="/register" 
              className="px-8 py-4 text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-full transition-all shadow-md hover:shadow-lg font-medium text-lg w-full sm:w-auto"
            >
              Start Swiping Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <FireIcon className="h-6 w-6 text-pink-500 mr-2" />
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">Fmengo</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                © {new Date().getFullYear()} Fmengo. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                Terms
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                Privacy
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                Safety
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                Contact
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Swipe responsibly. Fmengo encourages meaningful connections and respectful interactions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
