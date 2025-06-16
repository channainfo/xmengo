import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { HeartIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    age: number;
    photos: {
      id: string;
      url: string;
      isMain: boolean;
    }[];
  };
}

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const { checkUserOnlineStatus } = useSocket();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/matches', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMatches(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [token]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pb-16 sm:pb-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Matches</h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading matches...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-md">
          {error}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-5xl mb-4">💔</div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No matches yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Keep swiping to find your perfect match!
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <HeartIcon className="w-5 h-5 mr-2" />
            Discover People
          </Link>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {matches.map((match) => {
            const matchUser = match.user;
            const profilePhoto = matchUser.photos.find(p => p.isMain)?.url || '/placeholder-profile.svg';
            const isOnline = checkUserOnlineStatus(matchUser.id);

            return (
              <motion.div
                key={match.id}
                variants={item}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={profilePhoto}
                    alt={matchUser.name}
                    className="w-full aspect-square object-cover"
                  />
                  {isOnline && (
                    <div className="absolute top-2 right-2 flex items-center bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-xs text-white font-medium">Online</span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {matchUser.name}, {matchUser.age}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Matched {new Date(match.createdAt).toLocaleDateString()}
                  </p>

                  <div className="mt-3 flex space-x-2">
                    <Link
                      to={`/profile/${matchUser.id}`}
                      className="flex-1 flex items-center justify-center py-1 px-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <HeartIcon className="w-4 h-4 mr-1" />
                      Profile
                    </Link>
                    <Link
                      to={`/messages?matchId=${match.id}`}
                      className="flex-1 flex items-center justify-center py-1 px-2 bg-primary-600 hover:bg-primary-700 rounded text-sm font-medium text-white"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                      Chat
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default Matches;
