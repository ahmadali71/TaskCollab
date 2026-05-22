// src/components/Card3D.tsx
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glare?: boolean;
  tilt?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({ 
  children, 
  className = '', 
  glare = true,
  tilt = true,
  glow = false,
  onClick 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !tilt) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setRotate({ x: y * 15, y: x * 15 });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovering(false);
    scale.set(1);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        scale,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden cursor-pointer ${className} ${
        glow ? 'hover:shadow-blue-500/30' : ''
      }`}
    >
      {/* Glare effect */}
      {glare && isHovering && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${(rotate.y + 15) / 30 * 100}% ${(rotate.x + 15) / 30 * 100}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)`,
          }}
        />
      )}
      
      {/* Content with 3D transform */}
      <div style={{ transform: 'translateZ(20px)' }} className="relative z-0">
        {children}
      </div>
      
      {/* Glow border */}
      {glow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </motion.div>
  );
};