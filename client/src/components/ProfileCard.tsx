import React, { useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import PhotoGalleryModal from './PhotoGalleryModal';
import SparkleEffect from './SparkleEffect';
import { Profile } from '@/pages/Profile';

interface ProfileCardProps {
  user: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextPhoto = () => setCurrentPhoto((prev) => (prev + 1) % user.photos.length);
  const prevPhoto = () => setCurrentPhoto((prev) => (prev - 1 + user.photos.length) % user.photos.length);

  return (
    <>
      <Tilt
        tiltMaxAngleX={25}
        tiltMaxAngleY={25}
        scale={1.05}
        className="Tilt"
      >
        <motion.div
          className="relative w-80 h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsModalOpen(true)}
        >
          <div className="relative w-full h-3/4">
            <img
              src={user.photos[currentPhoto].url}
              alt={`${user.name}'s profile`}
              className="object-cover w-full h-full"
            />
            {currentPhoto === 0 && <SparkleEffect />}
            <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/50"></div>
            {user.photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevPhoto();
                  }}
                  className="absolute left-4 top-1/2 p-2 text-2xl text-white bg-black bg-opacity-50 rounded-full transform -translate-y-1/2"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextPhoto();
                  }}
                  className="absolute right-4 top-1/2 p-2 text-2xl text-white bg-black bg-opacity-50 rounded-full transform -translate-y-1/2"
                >
                  →
                </button>
              </>
            )}
            <div className="flex absolute bottom-4 justify-center w-full">
              {user.photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 mx-1 rounded-full ${index === currentPhoto ? 'bg-white' : 'bg-gray-400'
                    }`}
                />
              ))}
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold">
              {user.name}, {user.age}
            </h2>
            <p className="text-sm text-gray-600 truncate">{user.bio}</p>
          </div>
        </motion.div>
      </Tilt>
      <PhotoGalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        photos={user.photos.map(photo => photo.url)}
      />
    </>
  );
};

export default ProfileCard;