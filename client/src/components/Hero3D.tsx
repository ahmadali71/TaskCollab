// src/components/Hero3D.tsx
import React from 'react';
import { motion } from 'framer-motion';

export const Hero3D: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden perspective-1000">
      {/* 3D Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 3,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </div>

      {/* 3D Content */}
      <motion.div
        className="relative z-10 text-center text-white preserve-3d"
        initial={{ opacity: 0, rotateX: -20 }}
        animate={{ opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.8 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-4 text-3d"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          TaskCollab
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-blue-200 mb-8"
          style={{ transform: 'translateZ(30px)' }}
        >
          Task Management Reimagined in 3D
        </motion.p>
        
        <motion.button
          className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold text-lg shadow-2xl btn-3d"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Get Started
        </motion.button>
      </motion.div>

      {/* 3D Floating Card */}
      <motion.div
        className="absolute bottom-20 right-10 w-64 h-64 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4"
        animate={{ y: [0, -20, 0], rotateX: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="text-white text-center">
          <p className="text-sm opacity-80">Task Management</p>
          <p className="text-2xl font-bold">156</p>
          <p className="text-xs opacity-60">Active Tasks</p>
        </div>
      </motion.div>
    </div>
  );
};