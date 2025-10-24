
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import { Student } from '@/services/databaseService';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface UserProfileButtonProps {
  user: Student;
  onLogout: () => void;
  className?: string;
}

const UserProfileButton: React.FC<UserProfileButtonProps> = ({ user, onLogout, className }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`flex items-center justify-start gap-2 px-2 group hover:bg-primary/10 ${className}`}
        >
          <Avatar className="h-8 w-8 ring-2 ring-primary/30 group-hover:ring-primary/70 transition-all">
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left overflow-hidden">
            <span className="font-medium text-sm truncate max-w-[120px]">{user.name}</span>
            <span className={`text-xs truncate max-w-[120px] ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>{user.email}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col space-y-1 p-3">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => navigate('/profile')} 
          className="cursor-pointer"
        >
          <motion.div 
            whileHover={{ scale: 1.05, x: 2 }} 
            className="flex items-center w-full"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </motion.div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onLogout} 
          className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600"
        >
          <motion.div 
            whileHover={{ scale: 1.05, x: 2 }} 
            className="flex items-center w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </motion.div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileButton;
