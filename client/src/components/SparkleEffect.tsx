import { motion } from 'framer-motion';
import React from 'react';

const SparkleEffect: React.FC = () => {
  const sparkles = Array.from({ length: 5 }).map((_, index) => ({
    id: index,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-2 h-2 bg-white rounded-full opacity-0"
          style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: sparkle.delay,
          }}
        />
      ))}
    </div>
  );
};

export default SparkleEffect;