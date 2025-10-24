
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send, Image, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { AIMode } from '@/hooks/useAIMode';

interface InputAreaProps {
  mode: AIMode;
  input: string;
  isLoading: boolean;
  hasVoiceSupport?: boolean;
  isListening?: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStartListening?: () => void;
  onStopListening?: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  mode,
  input,
  isLoading,
  hasVoiceSupport,
  isListening,
  onInputChange,
  onSubmit,
  onStartListening,
  onStopListening
}) => {
  // Don't render input for history mode
  if (mode === 'history') return null;

  const getModeIcon = () => {
    switch (mode) {
      case 'code':
        return <Code className="h-4 w-4 mr-2" />;
      case 'image':
        return <Image className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const getPlaceholder = () => {
    switch (mode) {
      case 'chat':
        return 'Ask me anything...';
      case 'code':
        return 'Ask for code help or examples...';
      case 'image':
        return 'Describe an image to generate...';
      case 'voice':
        return 'Type or speak your message...';
      case 'translate':
        return 'Enter text to translate...';
      default:
        return 'Type your message...';
    }
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-20 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90"
      style={{ 
        width: 'calc(100% - 240px)', // Adjust width to account for sidebar
        marginLeft: '240px', // Match sidebar width
        maxWidth: '100%' // Ensure it doesn't exceed the viewport
      }}
    >
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          {mode === 'voice' && hasVoiceSupport && (
            <Button
              type="button"
              size="icon"
              variant={isListening ? "destructive" : "secondary"}
              onClick={isListening ? onStopListening : onStartListening}
              className={`${isListening ? "animate-pulse ring-2 ring-red-500" : ""} rounded-full`}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          )}
          
          <div className="relative flex-1">
            {getModeIcon() && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {getModeIcon()}
              </div>
            )}
            
            <Input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={getPlaceholder()}
              className={`flex-1 pr-12 ${getModeIcon() ? 'pl-10' : ''} bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus-visible:ring-blue-500`}
              disabled={isLoading}
            />
            
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading || !input.trim()}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full h-8 w-8 flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          {mode === 'chat' && "Ask me anything - I'm here to assist you"}
          {mode === 'code' && "Need code help? Ask for examples or explanations"}
          {mode === 'image' && "Describe what you want to see in the image"}
          {mode === 'voice' && "Press the mic button to speak, or just type"}
          {mode === 'translate' && "Enter text in any language to translate it"}
        </div>
      </form>
    </motion.div>
  );
};

export default InputArea;
