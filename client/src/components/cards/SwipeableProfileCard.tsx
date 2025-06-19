import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

interface Interest {
  id: string;
  name: string;
}

interface SwipeableProfileCardProps {
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
  onSuperLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onViewProfile?: (id: string) => void;
  isActive: boolean;
  onSwiped: () => void;
}

const SwipeableProfileCard: React.FC<SwipeableProfileCardProps> = ({
  id,
  name,
  age,
  bio,
  distance,
  photos,
  interests,
  isOnline,
  onLike,
  onPass,
  onSuperLike,
  onBookmark,
  onViewProfile,
  isActive,
  onSwiped
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [liked, setLiked] = useState(false);
  const [superLiked, setSuperLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [swipeComplete, setSwipeComplete] = useState(false);

  // Motion values for the swipe gesture
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20]);

  // Transform for visual feedback during swipe
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superLikeOpacity = useTransform(y, [-100, 0], [1, 0]);

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

  const handleLike = () => {
    setLiked(true);
    onLike(id);
    setSwipeComplete(true);
    setTimeout(() => {
      onSwiped();
    }, 300);
  };

  const handlePass = () => {
    onPass(id);
    setSwipeComplete(true);
    setTimeout(() => {
      onSwiped();
    }, 300);
  };

  const handleSuperLike = () => {
    setSuperLiked(true);
    if (onSuperLike) onSuperLike(id);
    setSwipeComplete(true);
    setTimeout(() => {
      onSwiped();
    }, 300);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    if (onBookmark) onBookmark(id);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const yThreshold = -100;

    if (info.offset.x > threshold) {
      // Swiped right = like
      handleLike();
    } else if (info.offset.x < -threshold) {
      // Swiped left = pass
      handlePass();
    } else if (info.offset.y < yThreshold) {
      // Swiped up = super like
      handleSuperLike();
    } else {
      // Reset position if not swiped far enough
      x.set(0);
      y.set(0);
    }
  };

  return (
    <AnimatePresence>
      {isActive && !swipeComplete && (
        <motion.div
          className="absolute top-0 left-0 right-0 w-full max-w-md mx-auto h-[calc(100vh-200px)] z-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{
            x: liked ? 500 : superLiked ? 0 : -500,
            y: superLiked ? -500 : 0,
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.3 }
          }}
          style={{ x, y, rotate }}
          drag={true}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: "grabbing" }}
        >
          {/* Feedback overlays */}
          <motion.div
            className="absolute top-10 right-10 z-30 px-8 py-2 rounded-lg border-4 border-green-500 transform rotate-12"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-3xl font-bold text-green-500">LIKE</span>
          </motion.div>

          <motion.div
            className="absolute top-10 left-10 z-30 px-8 py-2 rounded-lg border-4 border-red-500 transform -rotate-12"
            style={{ opacity: passOpacity }}
          >
            <span className="text-3xl font-bold text-red-500">PASS</span>
          </motion.div>

          <motion.div
            className="absolute top-10 left-1/2 z-30 px-4 py-2 rounded-lg border-4 border-blue-500 transform -rotate-2 -translate-x-1/2"
            style={{ opacity: superLikeOpacity }}
          >
            <span className="text-3xl font-bold text-blue-500">SUPER LIKE</span>
          </motion.div>

          {/* Card Content */}
          <div className="overflow-hidden relative w-full h-full bg-white rounded-2xl shadow-xl dark:bg-gray-800">
            <div className="relative w-full h-full" onClick={toggleDetails}>
              {/* Photos */}
              <div className="overflow-hidden relative w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhotoIndex}
                    src={photos[currentPhotoIndex]?.url || '/placeholder-profile.svg'}
                    alt={`${name}'s photo ${currentPhotoIndex + 1}`}
                    className="object-cover w-full h-full"
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

                {/* Bookmark button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmark();
                  }}
                  className="absolute top-4 left-4 p-2 rounded-full backdrop-blur-sm bg-black/30"
                >
                  {bookmarked ? (
                    <BookmarkIconSolid className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <BookmarkIcon className="w-5 h-5 text-white" />
                  )}
                </button>

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
              <div className="absolute right-0 bottom-0 left-0 p-5 bg-gradient-to-t to-transparent from-black/80 via-black/50">
                <div className="flex items-center">
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <h2 className="text-2xl font-bold text-white">{name}, {age}</h2>
                      {isOnline && (
                        <span className="ml-2 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white animate-pulse"></span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm font-medium text-white/80">{distance}</p>
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
                    className="overflow-hidden absolute right-0 bottom-0 left-0 p-5 rounded-t-2xl backdrop-blur-md bg-white/90 dark:bg-gray-800/90"
                  >
                    <div className="mx-auto mb-4 w-12 h-1 bg-gray-300 rounded-full dark:bg-gray-600" />

                    {bio && (
                      <div className="mb-4">
                        <h4 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">About</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{bio}</p>
                      </div>
                    )}

                    {interests.length > 0 && (
                      <div className="mb-4">
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

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onViewProfile) onViewProfile(id);
                      }}
                      className="py-2 mt-2 w-full text-sm font-medium rounded-lg text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-400"
                    >
                      View Full Profile
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SwipeableProfileCard;
