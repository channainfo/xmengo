import React, { useState, useEffect } from 'react';
import SwipeableProfileCard from './SwipeableProfileCard';
import { motion } from 'framer-motion';

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

interface Interest {
  id: string;
  name: string;
}

interface Profile {
  id: string;
  userId?: string;
  name: string;
  age?: number;
  bio?: string;
  dateOfBirth?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  photos?: Photo[];
  interests?: Interest[];
  lastActive?: string;
}

interface SwipeableProfileDeckProps {
  profiles: Profile[];
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  onSuperLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onViewProfile?: (id: string) => void;
  calculateDistance: (profile: Profile) => string | undefined;
  calculateAge: (profile: Profile) => number | undefined;
  checkUserOnlineStatus: (userId: string) => boolean;
  onEmpty?: () => void;
}

const SwipeableProfileDeck: React.FC<SwipeableProfileDeckProps> = ({
  profiles,
  onLike,
  onPass,
  onSuperLike,
  onBookmark,
  onViewProfile,
  calculateDistance,
  checkUserOnlineStatus,
  onEmpty
}) => {
  // We'll show 3 cards at a time in the stack
  const [currentProfiles, setCurrentProfiles] = useState<Profile[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Initialize with the first few profiles
    setCurrentProfiles(profiles.slice(0, 3));
  }, [profiles]);

  const handleSwiped = () => {
    // After a profile is swiped, update the active index
    if (activeIndex < profiles.length - 1) {
      // Add the next profile to the stack if available
      if (currentProfiles.length < 3 && activeIndex + currentProfiles.length < profiles.length) {
        setCurrentProfiles([
          ...currentProfiles,
          profiles[activeIndex + currentProfiles.length]
        ]);
      }

      // Move to the next profile
      setActiveIndex(activeIndex + 1);
    } else {
      // No more profiles
      if (onEmpty) {
        setTimeout(() => {
          onEmpty();
        }, 500);
      }
    }
  };

  // Helper function to get visible profiles
  const getVisibleProfiles = () => {
    return currentProfiles.slice(0, 3);
  };

  return (
    <div className="relative h-[calc(100vh-200px)] w-full max-w-md mx-auto">
      {/* Empty state */}
      {currentProfiles.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col justify-center items-center p-6 h-full text-center bg-gray-50 rounded-2xl shadow-sm dark:bg-gray-800/30"
        >
          <div className="mb-6 text-6xl">😢</div>
          <h3 className="mb-3 text-2xl font-medium text-gray-900 dark:text-white">No more profiles</h3>
          <p className="mx-auto max-w-md text-gray-600 dark:text-gray-400">
            Check back later for new matches or adjust your preferences to see more people.
          </p>
          <button className="px-6 py-3 mt-6 font-medium text-white rounded-full transition-colors bg-primary-500 hover:bg-primary-600">
            Adjust Preferences
          </button>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex absolute right-0 left-0 bottom-4 z-50 justify-center space-x-4">
        <button
          onClick={() => {
            if (currentProfiles.length > 0) {
              onPass(currentProfiles[0].id);
              handleSwiped();
            }
          }}
          className="flex justify-center items-center w-14 h-14 text-gray-500 bg-white rounded-full shadow-lg transition-all transform hover:bg-red-50 hover:text-red-500 hover:scale-105 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-red-400"
          aria-label="Pass"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          onClick={() => {
            if (currentProfiles.length > 0 && onSuperLike) {
              onSuperLike(currentProfiles[0].id);
              handleSwiped();
            }
          }}
          className="flex justify-center items-center w-12 h-12 text-blue-500 bg-white rounded-full shadow-md transition-all transform hover:bg-blue-50 hover:scale-105 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-400"
          aria-label="Super Like"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        <button
          onClick={() => {
            if (currentProfiles.length > 0) {
              onLike(currentProfiles[0].id);
              handleSwiped();
            }
          }}
          className="flex justify-center items-center w-14 h-14 text-red-500 bg-white rounded-full shadow-lg transition-all transform hover:bg-red-50 hover:scale-105 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-400"
          aria-label="Like"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Profile cards stack */}
      <div className="relative w-full h-full">
        {getVisibleProfiles().map((profile, index) => {
          // Calculate if this card is active (top of the stack)
          const isActive = index === 0;

          // Calculate age
          let age = profile.age;
          if (!age && profile.dateOfBirth) {
            const birthDate = new Date(profile.dateOfBirth);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
          }

          // Ensure photos array exists
          const photos = profile.photos || [];

          // Ensure interests array exists
          const interests = profile.interests || [];

          return (
            <SwipeableProfileCard
              key={profile.id}
              id={profile.id}
              name={profile.name || 'Unknown'}
              age={age || 25} // Default age if not available
              bio={profile.bio}
              distance={calculateDistance(profile)}
              photos={photos}
              interests={interests}
              isOnline={checkUserOnlineStatus(profile.userId || profile.id)}
              onLike={onLike}
              onPass={onPass}
              onSuperLike={onSuperLike}
              onBookmark={onBookmark}
              onViewProfile={onViewProfile}
              isActive={isActive}
              onSwiped={handleSwiped}
            />
          );
        })}
      </div>

      {/* Instructions overlay - shown briefly when first using the feature */}
      <motion.div
        className="flex absolute inset-0 z-50 flex-col justify-center items-center pointer-events-none bg-black/70"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="px-6 text-center text-white">
          <h3 className="mb-6 text-2xl font-bold">Swipe Gestures</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mb-2 w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <p>Swipe Right<br />to Like</p>
            </div>
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mb-2 w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <p>Swipe Up<br />for Super Like</p>
            </div>
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mb-2 w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <p>Swipe Left<br />to Pass</p>
            </div>
          </div>
          <p className="text-gray-300">Tap on a profile to see more details</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SwipeableProfileDeck;
