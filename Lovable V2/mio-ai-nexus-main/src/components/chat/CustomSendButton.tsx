
import React from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

interface SendButtonProps {
  onClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const CustomSendButton: React.FC<SendButtonProps> = ({ onClick, isDisabled, isLoading }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Button 
      type="submit"
      size="icon" 
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`rounded-full ${
        isDarkMode 
          ? 'bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600' 
          : 'bg-gradient-to-br from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500'
      } transition-all duration-300 hover:shadow-lg hover:scale-105`}
    >
      <motion.div
        whileHover={{ scale: 1.05, rotate: 15 }} 
        whileTap={{ scale: 0.9, rotate: 0 }}
        className="w-full h-full flex items-center justify-center"
      >
        {isLoading ? (
          <motion.div 
            className="h-5 w-5 border-2 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <motion.div
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Send className="h-4 w-4 text-white" />
          </motion.div>
        )}
      </motion.div>
    </Button>
  );
};

export default CustomSendButton;
