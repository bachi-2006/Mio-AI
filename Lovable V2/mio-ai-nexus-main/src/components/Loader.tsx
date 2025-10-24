
import React from 'react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
  withLogo?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  color = 'primary',
  text,
  fullScreen = false,
  withLogo = false,
}) => {
  // Size mappings
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  // Color mappings
  const colors = {
    primary: 'border-blue-500 border-t-purple-600',
    secondary: 'border-gray-300 border-t-gray-800',
    white: 'border-white/30 border-t-white'
  };

  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 0.8
  };

  const loaderElement = withLogo ? (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={spinTransition}
        className="relative"
      >
        <div className={`${sizes[size]} border-4 border-solid ${colors[color]} rounded-full animate-none`}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Logo size={size === 'lg' ? 'md' : 'sm'} />
        </div>
      </motion.div>
      {text && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{text}</p>}
    </div>
  ) : (
    <div className={`flex flex-col items-center justify-center`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={spinTransition}
        className={`${sizes[size]} border-4 border-solid ${colors[color]} rounded-full`}
      ></motion.div>
      {text && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        {loaderElement}
      </div>
    );
  }

  return loaderElement;
};

export default Loader;
