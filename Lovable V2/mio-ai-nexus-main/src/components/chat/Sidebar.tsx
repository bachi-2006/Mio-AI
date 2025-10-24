
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { LogOut } from 'lucide-react';
import { AIMode } from '@/hooks/useAIMode';
import { MessageCircle, Code, Image, Mic, History } from 'lucide-react';
import { Translate } from '@/components/icons/Translate';
import { motion } from 'framer-motion';
import { User } from '@auth0/auth0-react';
import { Student } from '@/services/databaseService';
import UserProfileButton from '@/components/UserProfileButton';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useTheme } from '@/context/ThemeContext';

interface SidebarProps {
  mode: AIMode;
  onModeChange: (mode: AIMode) => void;
  onLogout: () => void;
  onClearHistory: () => void;  // Added this missing prop
  user: User | Student | undefined;
}

const Sidebar: React.FC<SidebarProps> = ({ mode, onModeChange, onLogout, onClearHistory, user }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  // Animation variants
  const containerVariants = {
    hidden: { x: -250, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  // Enhanced hover animation for tab triggers
  const tabHoverAnimation = {
    whileHover: { scale: 1.03, backgroundColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(243, 244, 246, 0.7)' },
    whileTap: { scale: 0.97 }
  };

  const handleModeChange = (newMode: AIMode) => {
    onModeChange(newMode);
  };
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`w-64 border-r flex flex-col ${
        isDarkMode 
          ? 'bg-gray-800/95 border-gray-700 text-gray-100' 
          : 'bg-white/95 border-gray-200 text-gray-800'
      } backdrop-blur-sm`}
    >
      <motion.div 
        variants={itemVariants}
        className={`p-4 border-b flex justify-between items-center ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <motion.div whileHover={{ scale: 1.05 }}>
          <Logo size="sm" />
        </motion.div>
        <ThemeSwitcher />
      </motion.div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <motion.h3 
          variants={itemVariants}
          className={`text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          AI Modes
        </motion.h3>
        <div className="flex flex-col h-auto space-y-1 bg-transparent">
          <motion.div variants={itemVariants}>
            <Button 
              variant={mode === 'chat' ? 'secondary' : 'ghost'}
              onClick={() => handleModeChange('chat')} 
              className="w-full justify-start text-left group transition-all"
              {...tabHoverAnimation}
            >
              <motion.div 
                className="flex items-center w-full"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <MessageCircle className={`mr-2 h-4 w-4 ${
                  mode === 'chat' ? 'text-primary' : ''
                } group-hover:text-primary transition-colors`} />
                <span>Chat</span>
              </motion.div>
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              variant={mode === 'code' ? 'secondary' : 'ghost'}
              onClick={() => handleModeChange('code')} 
              className="w-full justify-start text-left group transition-all"
              {...tabHoverAnimation}
            >
              <motion.div 
                className="flex items-center w-full"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Code className={`mr-2 h-4 w-4 ${
                  mode === 'code' ? 'text-primary' : ''
                } group-hover:text-primary transition-colors`} />
                <span>Code</span>
              </motion.div>
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              variant={mode === 'image' ? 'secondary' : 'ghost'}
              onClick={() => handleModeChange('image')} 
              className="w-full justify-start text-left group transition-all"
              {...tabHoverAnimation}
            >
              <motion.div 
                className="flex items-center w-full"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Image className={`mr-2 h-4 w-4 ${
                  mode === 'image' ? 'text-primary' : ''
                } group-hover:text-primary transition-colors`} />
                <span>Image</span>
              </motion.div>
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              variant={mode === 'voice' ? 'secondary' : 'ghost'}
              onClick={() => handleModeChange('voice')} 
              className="w-full justify-start text-left group transition-all"
              {...tabHoverAnimation}
            >
              <motion.div 
                className="flex items-center w-full"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Mic className={`mr-2 h-4 w-4 ${
                  mode === 'voice' ? 'text-primary' : ''
                } group-hover:text-primary transition-colors`} />
                <span>Voice</span>
              </motion.div>
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              variant={mode === 'translate' ? 'secondary' : 'ghost'}
              onClick={() => handleModeChange('translate')} 
              className="w-full justify-start text-left group transition-all"
              {...tabHoverAnimation}
            >
              <motion.div 
                className="flex items-center w-full"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Translate className={`mr-2 h-4 w-4 ${
                  mode === 'translate' ? 'text-primary' : ''
                } group-hover:text-primary transition-colors`} />
                <span>Translate</span>
              </motion.div>
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              variant={mode === 'history' ? 'secondary' : 'ghost'}
              onClick={() => handleModeChange('history')} 
              className="w-full justify-start text-left group transition-all"
              {...tabHoverAnimation}
            >
              <motion.div 
                className="flex items-center w-full"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <History className={`mr-2 h-4 w-4 ${
                  mode === 'history' ? 'text-primary' : ''
                } group-hover:text-primary transition-colors`} />
                <span>History</span>
              </motion.div>
            </Button>
          </motion.div>
        </div>
        
        {/* Add a clear history button */}
        <motion.div variants={itemVariants} className="mt-4">
          <Button 
            variant="outline" 
            onClick={onClearHistory} 
            className="w-full justify-start text-left group hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
          >
            <motion.div 
              className="flex items-center w-full"
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <History className="mr-2 h-4 w-4 group-hover:text-red-500 transition-colors" />
              <span>Clear Current History</span>
            </motion.div>
          </Button>
        </motion.div>
      </div>
      
      <motion.div 
        variants={itemVariants}
        className={`p-4 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        {user && ('rollNo' in user) ? (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <UserProfileButton 
              user={user as Student} 
              onLogout={onLogout}
              className="w-full mb-3"
            />
          </motion.div>
        ) : (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              className="w-full justify-start group hover:bg-primary/10 transition-colors" 
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
              <span>Log Out</span>
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
