import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

interface Interest {
  id: string;
  name: string;
}

interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  bio?: string;
  distance?: string;
  photos: Photo[];
  interests: Interest[];
  isOnline?: boolean;
  onLike: (id: string) => void;
  onPass: (id: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  name,
  age,
  bio,
  distance,
  photos,
  interests,
  isOnline,
  onLike,
  onPass
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [liked, setLiked] = useState(false);

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPhotoIndex < photos.length - 1) {
      setDirection('right');
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPhotoIndex > 0) {
      setDirection('left');
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };


  const handlePass = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPass(id);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow"
    >
      {/* Card Content */}
      <div className="relative" onClick={toggleDetails}>
        {/* Photos */}
        <div className="relative h-96 w-full overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPhotoIndex}
              src={photos[currentPhotoIndex]?.url || '/placeholder-profile.svg'}
              alt={`${name}'s photo ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover"
              initial={{ x: direction === 'right' ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === 'right' ? -300 : 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </AnimatePresence>

          {/* Photo Navigation */}
          {photos.length > 1 && (
            <div className="flex absolute top-0 right-0 left-0 justify-between p-2">
              <div className="flex space-x-1">
                {photos.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${index === currentPhotoIndex
                        ? 'w-6 bg-white'
                        : 'w-2 bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Online Status */}
          {isOnline && (
            <div className="flex absolute top-4 right-4 items-center px-2 py-1 rounded-full backdrop-blur-sm bg-black/30">
              <div className="mr-1 w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-white">Online</span>
            </div>
          )}

          {/* Photo Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                disabled={currentPhotoIndex === 0}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center ${currentPhotoIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/50'
                  }`}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextPhoto}
                disabled={currentPhotoIndex === photos.length - 1}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center ${currentPhotoIndex === photos.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/50'
                  }`}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          <div className="flex items-center">
            <div className="flex-grow">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-white">{name}, {age}</h2>
                {isOnline && (
                  <span className="ml-2 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white animate-pulse"></span>
                )}
              </div>
              <div className="flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/70 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-white/80 text-sm font-medium">{distance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden px-4 pb-4"
            >
              {bio && (
                <div className="mb-4">
                  <h4 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">About</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{bio}</p>
                </div>
              )}

              {interests.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <span
                        key={interest.id}
                        className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-200"
                      >
                        {interest.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={(e) => handlePass(e)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-white text-gray-500 shadow-lg hover:bg-red-50 hover:text-red-500 transform hover:scale-105 transition-all dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-red-400"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            // Open chat with this user
            console.log('Open chat with user:', id);
          }}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-blue-500 shadow-md hover:bg-blue-50 transform hover:scale-105 transition-all dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-400"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
            onLike(id);
          }}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transform hover:scale-105 transition-all
            ${liked ? 'bg-red-500 text-white' : 'bg-white text-red-500 hover:bg-red-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-400'}`}
        >
          {liked ? <HeartIconSolid className="w-7 h-7" /> : <HeartIcon className="w-7 h-7" />}
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
