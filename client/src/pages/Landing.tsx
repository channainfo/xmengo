import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import FmengoLogo from '../components/ui/FmengoLogo';

const Landing: React.FC = () => {
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">

      {/* Hero Section with Card Stack */}
      <section className="flex flex-col flex-grow justify-center items-center px-6 py-12 mx-auto max-w-7xl md:flex-row md:py-20">

        <motion.div
          className="mb-12 w-full md:w-1/2 md:mb-0 md:pr-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Swipe <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">right</span> for love
          </motion.h1>

          <motion.p
            className="mb-8 text-xl leading-relaxed text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join millions finding meaningful connections every day.
            Fmengo matches you with people who share your interests and values.
          </motion.p>

          <motion.div
            className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/register"
              className="px-8 py-3 font-medium text-center text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-full shadow-md transition-all hover:from-pink-600 hover:to-orange-600 hover:shadow-lg"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="px-8 py-3 font-medium text-center text-pink-700 bg-white bg-opacity-50 rounded-full border border-pink-500 shadow-md transition-all dark:text-pink-300 dark:border-pink-400 dark:bg-white dark:bg-opacity-10 hover:bg-opacity-70 dark:hover:bg-opacity-20 hover:shadow-lg"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>

        {/* Tinder-style card stack */}
        <div className="flex justify-center items-center w-full md:w-1/2">
          <div className="relative w-72 h-96">
            <AnimatePresence>
              <motion.div
                key={currentProfile}
                className="overflow-hidden absolute top-0 left-0 w-full h-full bg-white rounded-2xl shadow-xl dark:bg-gray-800"
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
                  className="object-cover w-full h-3/4"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{profiles[currentProfile].name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{profiles[currentProfile].bio}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Swipe buttons */}
            <div className="flex absolute left-0 -bottom-16 justify-center mt-4 space-x-6 w-full">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex justify-center items-center w-12 h-12 bg-white rounded-full border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700"
                onClick={() => handleSwipe('left')}
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex justify-center items-center w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full shadow-lg"
                onClick={() => handleSwipe('right')}
              >
                <HeartIcon className="w-6 h-6 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            className="mb-12 text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Why Everyone Loves Fmengo
          </motion.h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
                className="p-6 bg-white rounded-2xl border border-pink-100 shadow-lg transition-all dark:bg-gray-800 hover:shadow-xl dark:border-pink-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            className="mb-12 text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Success Stories
          </motion.h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                className="flex overflow-hidden flex-col bg-white rounded-2xl shadow-lg dark:bg-gray-800 md:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <div className="w-full md:w-1/3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6 w-full md:w-2/3">
                  <p className="mb-6 text-lg italic text-gray-700 dark:text-gray-300">
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
      <section className="px-6 py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            className="mb-6 text-4xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your perfect match is just a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">swipe away</span>
          </motion.h2>

          <motion.p
            className="mb-8 text-lg text-gray-700 dark:text-gray-300"
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
            className="flex flex-col justify-center items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
          >
            <Link
              to="/register"
              className="px-8 py-4 w-full text-lg font-medium text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-full shadow-md transition-all hover:from-pink-600 hover:to-orange-600 hover:shadow-lg sm:w-auto"
            >
              Start Swiping Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-white dark:bg-gray-900">
        <div className="mx-auto">
          <div className="flex flex-col justify-between items-center md:flex-row">
            <div className="mb-6 md:mb-0">
              <FmengoLogo size="md" />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Fmengo. All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap justify-center space-x-6">
              <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                Terms
              </Link>
              <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                Privacy
              </Link>
              <Link to="/safety" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                Safety
              </Link>
              <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                Contact
              </Link>
            </div>
          </div>

          <div className="pt-8 mt-8 text-sm text-center text-gray-500 border-t border-gray-200 dark:border-gray-700 dark:text-gray-400">
            <p>Swipe responsibly. Fmengo encourages meaningful connections and respectful interactions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
