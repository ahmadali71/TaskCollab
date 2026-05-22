// src/components/Button3D.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface Button3DProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const Button3D: React.FC<Button3DProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/30',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-gray-500/30',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ 
        scale: 1.05,
        y: -2,
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
      }}
      whileTap={{ 
        scale: 0.98,
        y: 1
      }}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
        relative rounded-xl font-semibold text-white
        transform transition-all duration-200
        shadow-lg hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center space-x-2
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
      
      {/* 3D shadow effect */}
      <div 
        className="absolute inset-0 rounded-xl bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200"
        style={{ transform: 'translateZ(-10px)' }}
      />
    </motion.button>
  );
};