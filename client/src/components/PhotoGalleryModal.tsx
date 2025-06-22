import React, { useState } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: string[];
}

const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({ isOpen, onClose, photos }) => {
  const [zoom, setZoom] = useState(1);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const handleZoom = (e: React.WheelEvent) => {
    setZoom((prev) => Math.max(1, Math.min(prev + e.deltaY * -0.01, 3)));
  };

  const nextPhoto = () => setCurrentPhoto((prev) => (prev + 1) % photos.length);
  const prevPhoto = () => setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-80"
      overlayClassName="fixed inset-0"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mx-auto w-full max-w-3xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-2xl text-white"
        >
          &times;
        </button>
        <div
          className="overflow-hidden relative rounded-lg"
          onWheel={handleZoom}
          style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}
        >
          <img
            src={photos[currentPhoto]}
            alt="Profile"
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 p-2 text-3xl text-white bg-black bg-opacity-50 rounded-full transform -translate-y-1/2"
              >
                &larr;
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 p-2 text-3xl text-white bg-black bg-opacity-50 rounded-full transform -translate-y-1/2"
              >
                &rarr;
              </button>
            </>
          )}
        </div>
        <div className="flex justify-center mt-4">
          {photos.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 mx-1 rounded-full ${index === currentPhoto ? 'bg-white' : 'bg-gray-500'
                }`}
            />
          ))}
        </div>
      </motion.div>
    </Modal>
  );
};

export default PhotoGalleryModal;