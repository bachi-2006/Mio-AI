
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const BackgroundEffects: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Soft gradient background */}
      <div 
        className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-tr from-indigo-900/10 via-purple-900/5 to-blue-900/10' 
            : 'bg-gradient-to-tr from-indigo-100/30 via-purple-100/20 to-blue-100/30'
        }`}
      />
      
      {/* Animated orbs */}
      <motion.div
        className={`absolute top-20 left-[10%] w-64 h-64 rounded-full opacity-30 filter blur-3xl ${
          isDarkMode ? 'bg-violet-600' : 'bg-violet-300'
        }`}
        animate={{
          x: [0, 30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div
        className={`absolute bottom-40 right-[15%] w-72 h-72 rounded-full opacity-20 filter blur-3xl ${
          isDarkMode ? 'bg-blue-500' : 'bg-blue-200'
        }`}
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </div>
  );
};

export default BackgroundEffects;
