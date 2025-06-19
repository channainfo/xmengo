import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useSocket } from '../contexts/SocketContext';
import { matchesAPI } from '../services/api';

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  photos: Photo[];
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

interface Match {
  id: string;
  userId: string;
  matchedId: string;
  createdAt: string;
  displayUser: User;
  messages: Message[];
  user?: User;
  matchedUser?: User;
}

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkUserOnlineStatus } = useSocket();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await matchesAPI.getMatches();

        // Log the full response for debugging
        console.log('Matches API Response:', response);

        // Handle the response properly
        if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          // Transform the data to match our expected structure
          const transformedMatches = response.data.data.map((match: any) => ({
            id: match.id,
            userId: match.userId,
            matchedId: match.matchedId,
            createdAt: match.createdAt,
            // Always display the matched user's profile
            displayUser: match.userId === localStorage.getItem('userId')
              ? match.matchedUser
              : match.user,
            messages: match.messages?.length ? match.messages : []
          }));

          // Log the transformed matches
          console.log('Transformed Matches:', transformedMatches);

          setMatches(transformedMatches);
          setError(null);
        } else {
          console.error('Invalid matches response:', response);
          setMatches([]);
          setError('Failed to load matches. Please try again later.');
        }
      } catch (err: any) {
        console.error('Error fetching matches:', err);
        setMatches([]);
        setError('Failed to load matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);  // Removed token dependency since it's handled in the API service

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
    // <div className="pb-16 sm:pb-0">
    <div className="px-4 pb-16 mx-auto max-w-6xl sm:pb-0">

      <h1 className="py-2 text-3xl font-bold text-primary-600 dark:text-primary-500">Your Matches</h1>
      <p className="mt-1 mb-8 text-sm text-gray-500 dark:text-gray-400">
        Start messaging your matches to get to know them better.
      </p>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="mb-4 w-12 h-12 rounded-full border-t-2 border-b-2 animate-spin border-primary-500"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading matches...</p>
        </div>
      ) : error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      ) : !matches || matches.length === 0 ? (
        <div className="p-6 py-12 text-center bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="mb-4 text-5xl">💔</div>
          <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">No matches yet</h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Keep swiping to find your perfect match!
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md border border-transparent shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <HeartIcon className="mr-2 w-5 h-5" />
            Discover People
          </Link>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {matches?.map((match) => {
            const isOnline = checkUserOnlineStatus(match.displayUser?.id);

            return (
              <motion.div
                key={match.id}
                variants={item}
                className="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800"
              >
                <div className="relative">
                  <img
                    src={match.displayUser.photos[0]?.url || '/default-avatar.png'}
                    alt={match.displayUser.name}
                    className="object-cover w-full aspect-square"
                  />
                  {isOnline && (
                    <div className="flex absolute top-2 right-2 items-center px-2 py-1 rounded-full backdrop-blur-sm bg-black/30">
                      <div className="mr-1 w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-white">Online</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {match.displayUser.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {match.displayUser.age} • {match.displayUser.gender}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Matched {new Date(match?.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex mt-3 space-x-2">
                    <Link
                      to={`/profile/${match.displayUser.id}`}
                      className="flex flex-1 justify-center items-center px-2 py-1 text-sm font-medium text-gray-700 rounded border border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <HeartIcon className="mr-1 w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to={`/messages?matchId=${match.id}`}
                      className="flex flex-1 justify-center items-center px-2 py-1 text-sm font-medium text-white rounded bg-primary-600 hover:bg-primary-700"
                    >
                      <ChatBubbleLeftRightIcon className="mr-1 w-4 h-4" />
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
