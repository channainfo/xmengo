import React, { useState } from 'react';
import { useGetRecommendedUsersQuery } from '../api';
import { useAppDispatch } from '../store';

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
      <div className="h-full w-full">
        <img
          src={user.profilePicture || 'https://via.placeholder.com/400x600?text=No+Image'}
          alt={user.name}
          className="h-full w-full object-cover"
        />
      </div>
      
      {/* User info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
        <h3 className="text-2xl font-bold">{user.name}</h3>
        {user.bio && <p className="mt-1">{user.bio}</p>}
      </div>
      
      {/* Action buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-6">
        <button 
          onClick={onDislike}
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button 
          onClick={onLike}
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-green-500 hover:bg-green-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  const dispatch = useAppDispatch();

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
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error loading profiles</h2>
        <p className="text-gray-600 dark:text-gray-300">Please try again later</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
        <h2 className="text-2xl font-bold mb-4">No more profiles</h2>
        <p className="text-gray-600 dark:text-gray-300">Check back later for more matches</p>
      </div>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
        <h2 className="text-2xl font-bold mb-4">You've seen all profiles</h2>
        <p className="text-gray-600 dark:text-gray-300">Check back later for more matches</p>
        <button 
          onClick={() => setCurrentIndex(0)}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Find Your Match</h1>
      
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
