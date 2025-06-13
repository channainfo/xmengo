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

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(true);
    onLike(id);
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800"
    >
      {/* Card Content */}
      <div className="relative" onClick={toggleDetails}>
        {/* Photos */}
        <div className="relative h-96 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPhotoIndex}
              src={photos[currentPhotoIndex]?.url || '/placeholder-profile.jpg'}
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
            <div className="absolute top-0 left-0 right-0 flex justify-between p-2">
              <div className="flex space-x-1">
                {photos.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentPhotoIndex
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
            <div className="absolute top-4 right-4 flex items-center bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-white font-medium">Online</span>
            </div>
          )}

          {/* Photo Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                disabled={currentPhotoIndex === 0}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center ${
                  currentPhotoIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/50'
                }`}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextPhoto}
                disabled={currentPhotoIndex === photos.length - 1}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center ${
                  currentPhotoIndex === photos.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/50'
                }`}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Basic Info */}
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {name}, {age}
              </h3>
              {distance && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {distance} away
                </p>
              )}
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
              className="px-4 pb-4 overflow-hidden"
            >
              {bio && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{bio}</p>
                </div>
              )}

              {interests.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <span
                        key={interest.id}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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
      <div className="flex justify-center space-x-4 p-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handlePass}
          className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-gray-600 transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <button
          onClick={handleLike}
          className={`w-12 h-12 rounded-full ${
            liked ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-white dark:bg-gray-700'
          } shadow-md flex items-center justify-center text-primary-500 hover:bg-primary-50 dark:hover:bg-gray-600 transition-colors`}
        >
          {liked ? (
            <HeartIconSolid className="w-6 h-6 text-primary-500" />
          ) : (
            <HeartIcon className="w-6 h-6" />
          )}
        </button>
        <button
          className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
