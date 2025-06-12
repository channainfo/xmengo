import React, { useState } from 'react';
import { useGetRecommendedUsersQuery } from '../api';

// Card component for displaying user profiles
const UserCard: React.FC<{
  user: {
    id: string;
    name: string;
    bio?: string;
    profilePicture?: string;
    photos: string[];
  };
  onLike: () => void;
  onDislike: () => void;
}> = ({ user, onLike, onDislike }) => {
  return (
    <div className="relative w-full max-w-sm mx-auto h-[70vh] rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
      {/* User photo */}
      <div className="w-full h-full">
        <img
          src={user.profilePicture || 'https://via.placeholder.com/400x600?text=No+Image'}
          alt={user.name}
          className="object-cover w-full h-full"
        />
      </div>

      {/* User info overlay */}
      <div className="absolute right-0 bottom-0 left-0 p-4 text-white bg-gradient-to-t to-transparent from-black/80">
        <h3 className="text-2xl font-bold">{user.name}</h3>
        {user.bio && <p className="mt-1">{user.bio}</p>}
      </div>

      {/* Action buttons */}
      <div className="flex absolute right-0 left-0 bottom-4 justify-center space-x-6">
        <button
          onClick={onDislike}
          className="flex justify-center items-center w-14 h-14 text-red-500 bg-white rounded-full shadow-lg transition-colors hover:bg-red-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          onClick={onLike}
          className="flex justify-center items-center w-14 h-14 text-green-500 bg-white rounded-full shadow-lg transition-colors hover:bg-green-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { data: users = [], isLoading, error } = useGetRecommendedUsersQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  // const dispatch = useAppDispatch();

  const handleLike = () => {
    // In a real app, we would call an API to like the user
    console.log('Liked user:', users[currentIndex]);

    // Move to the next user
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDislike = () => {
    // In a real app, we might want to track dislikes as well
    console.log('Disliked user:', users[currentIndex]);

    // Move to the next user
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
        <h2 className="mb-4 text-2xl font-bold text-red-500">Error loading profiles</h2>
        <p className="text-gray-600 dark:text-gray-300">Please try again later</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
        <h2 className="mb-4 text-2xl font-bold">No more profiles</h2>
        <p className="text-gray-600 dark:text-gray-300">Check back later for more matches</p>
      </div>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
        <h2 className="mb-4 text-2xl font-bold">You've seen all profiles</h2>
        <p className="text-gray-600 dark:text-gray-300">Check back later for more matches</p>
        <button
          onClick={() => setCurrentIndex(0)}
          className="px-6 py-2 mt-6 text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-opacity hover:opacity-90"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center text-gray-800 dark:text-white">Find Your Match</h1>

      <UserCard
        user={users[currentIndex]}
        onLike={handleLike}
        onDislike={handleDislike}
      />

      <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
        <p>Swipe right to like, swipe left to pass</p>
      </div>
    </div>
  );
};

export default Home;
