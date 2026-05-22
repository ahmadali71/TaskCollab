// src/components/FlipCard3D.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FlipCard3DProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  width?: string;
  height?: string;
}

export const FlipCard3D: React.FC<FlipCard3DProps> = ({
  front,
  back,
  className = '',
  width = 'w-full',
  height = 'h-64'
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`relative ${width} ${height} cursor-pointer ${className}`}
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        
        {/* Back */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
};