// src/components/DarkModeToggle.tsx
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import { motion } from 'framer-motion';

export const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      )}
    </motion.button>
  );
};