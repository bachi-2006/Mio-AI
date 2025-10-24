
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, User, LoaderCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';
import { AIMode } from '@/hooks/useAIMode';
import { Message } from '@/types/message';

interface MessageListProps {
  messages: Message[];
  mode: AIMode;
  isLoading?: boolean;
  onPlayVoice?: (text: string) => void;
  onStopVoice?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  mode,
  isLoading,
  onPlayVoice,
  onStopVoice
}) => {
  // Filter messages by current mode for display
  console.log("MessageList - Messages for mode:", mode, messages);

  const formatMessageContent = (content: string) => {
    if (!content.includes('```')) return content;
    
    const parts = content.split(/```(?:(\w+)\n)?/);
    return parts.map((part, i) => {
      if (i % 2 === 0) {
        return <span key={i}>{part}</span>;
      } else if (i % 2 === 1 && parts[i+1]) {
        return (
          <div key={i} className="my-2">
            <div className="bg-gray-800 text-gray-200 p-1 text-xs rounded-t-md flex justify-between items-center">
              <span>{part || 'code'}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 py-0 px-2 text-xs text-gray-300 hover:text-white"
                onClick={() => {
                  navigator.clipboard.writeText(parts[i+1]);
                }}
              >
                Copy
              </Button>
            </div>
            <pre className="bg-gray-800 p-3 rounded-b-md overflow-x-auto">
              <code className="text-gray-200 text-sm font-mono">{parts[i+1]}</code>
            </pre>
          </div>
        );
      }
      return null;
    });
  };
  
  // Helper function to format timestamp
  const formatTimestamp = (timestamp: Date | string): string => {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // Handle string timestamp by creating a new Date object
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!messages || messages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full flex items-center justify-center p-4"
      >
        <div className="text-center p-8 max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <Logo size="lg" />
          <h2 className="text-xl font-semibold mt-6 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400">
            Welcome to {mode === 'code' ? 'Code Assistant' : 
            mode === 'image' ? 'Image Generator' : 
            mode === 'voice' ? 'Voice Assistant' : 
            mode === 'translate' ? 'Translation Assistant' : 'Mio AI'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            {mode === 'chat' && "I'm your multipurpose AI assistant. How can I help you today?"}
            {mode === 'code' && "Need help with coding? Ask me any programming question or request code examples."}
            {mode === 'image' && "Describe the image you want to create, and I'll generate it for you."}
            {mode === 'voice' && "Speak or type your question, and I'll respond with voice and text."}
            {mode === 'translate' && "Enter text in any language, and I'll translate it for you."}
          </p>
          
          <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-left max-w-md mx-auto">
            <h3 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Tips:</h3>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300 list-disc pl-5">
              {mode === 'chat' && (
                <>
                  <li>Ask general questions or advice</li>
                  <li>Request explanations of complex topics</li>
                  <li>Get help with problem-solving</li>
                </>
              )}
              {mode === 'code' && (
                <>
                  <li>Ask for code examples in any programming language</li>
                  <li>Get debugging help for your code</li>
                  <li>Learn programming concepts and best practices</li>
                </>
              )}
              {mode === 'image' && (
                <>
                  <li>Be specific about what you want in the image</li>
                  <li>Describe the style, colors, and composition</li>
                  <li>Mention any specific details you want included</li>
                </>
              )}
              {mode === 'voice' && (
                <>
                  <li>Click the microphone icon to speak</li>
                  <li>Adjust voice settings with the gear icon</li>
                  <li>Click the speaker icon on any message to hear it again</li>
                </>
              )}
              {mode === 'translate' && (
                <>
                  <li>Enter text in any language</li>
                  <li>Specify the target language: "Translate to Spanish: Hello"</li>
                  <li>Or just ask: "How do you say 'hello' in Japanese?"</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className="py-4 space-y-6 max-w-4xl mx-auto">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] lg:max-w-[70%] rounded-lg shadow-sm ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center p-3 border-b border-opacity-20 border-gray-200">
                {message.sender === 'ai' ? (
                  <Avatar className="h-6 w-6 mr-2">
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">
                      M
                    </div>
                  </Avatar>
                ) : (
                  <Avatar className="h-6 w-6 mr-2">
                    <User className="h-4 w-4" />
                  </Avatar>
                )}
                <div className="flex-1">
                  <span className="text-xs font-medium">
                    {message.sender === 'user' ? 'You' : 'Mio AI'}
                  </span>
                </div>
                <span className="text-xs opacity-75">
                  {formatTimestamp(message.timestamp)}
                </span>
                
                {message.sender === 'ai' && !message.imageUrl && onPlayVoice && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-1 h-6 w-6"
                    onClick={() => onPlayVoice(message.content)}
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </Button>
                )}
                
                {message.sender === 'ai' && mode === 'voice' && onStopVoice && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-1 h-6 w-6"
                    onClick={onStopVoice}
                  >
                    <VolumeX className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <div className="p-4">
                {message.imageUrl ? (
                  <div>
                    <p className={`text-sm mb-2 ${message.sender === 'user' ? 'text-white' : ''}`}>
                      {message.content}
                    </p>
                    <img 
                      src={message.imageUrl} 
                      alt="Generated image" 
                      className="rounded-md max-w-full max-h-96 mt-2" 
                      loading="eager"
                    />
                  </div>
                ) : (
                  <div 
                    className={`text-sm whitespace-pre-wrap ${message.sender === 'user' ? 'text-white' : ''}`}
                  >
                    {mode === 'code' && message.sender === 'ai' 
                      ? formatMessageContent(message.content)
                      : message.content
                    }
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MessageList;
