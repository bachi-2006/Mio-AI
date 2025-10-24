
import React, { useState, useRef, useEffect } from 'react';
import { useMessages } from '@/context/MessageContext';
import { Message } from '@/types/message';
import { sendMessageToGemini } from '@/services/geminiService';
import { toast } from 'sonner';
import { saveChatHistory } from '@/services/databaseService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import MessageList from '@/components/chat/MessageList';
import InputArea from '@/components/chat/InputArea';
import BackgroundEffects from '@/components/chat/BackgroundEffects';
import { AIMode } from '@/hooks/useAIMode';
import { LoaderCircle } from 'lucide-react';

interface BaseChatInterfaceProps {
  mode: AIMode;
  hasVoiceSupport?: boolean;
  isListening?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
  onPlayVoice?: (text: string) => void;
  onStopVoice?: () => void;
  isAutoPlayVoice?: boolean;
  onCustomSubmit?: (input: string) => Promise<void>;
}

const BaseChatInterface: React.FC<BaseChatInterfaceProps> = ({
  mode,
  hasVoiceSupport,
  isListening,
  onStartListening,
  onStopListening,
  onPlayVoice,
  onStopVoice,
  isAutoPlayVoice,
  onCustomSubmit
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, saveMessage } = useMessages();
  const { user } = useAuth();
  
  const modeMessages = messages.filter(msg => msg.mode === mode);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [modeMessages]);

  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `user_id=eq.${user.email}` },
        (payload) => {
          console.log('New message from Supabase:', payload);
          saveMessage({
            id: payload.new.id || Date.now().toString(),
            content: payload.new.content,
            sender: payload.new.sender,
            timestamp: new Date(payload.new.timestamp),
            mode: payload.new.mode,
            imageUrl: payload.new.image_url
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, saveMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // If onCustomSubmit is provided (for image mode), use that instead
    if (onCustomSubmit && mode === 'image') {
      await onCustomSubmit(input);
      setInput('');
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      mode
    };
    
    saveMessage(userMessage);
    setInput('');
    setIsLoading(true);
    
    try {
      console.log(`Sending message to Gemini in ${mode} mode:`, input);
      const response = await sendMessageToGemini(input, mode as any);
      console.log("Received response from Gemini:", response);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
        mode
      };
      
      saveMessage(aiMessage);
      console.log("AI response saved to messages");
      
      if (user) {
        saveChatHistory({
          id: aiMessage.id,
          userId: user.email,
          message: input,
          response,
          mode,
          timestamp: new Date()
        });
      }
      
      if (isAutoPlayVoice && onPlayVoice) {
        onPlayVoice(response);
      }
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BackgroundEffects />
      </div>
      
      <div className="flex-1 overflow-y-auto pb-36 px-4 md:px-8 lg:px-12">
        <MessageList 
          messages={modeMessages}
          mode={mode}
          isLoading={isLoading}
          onPlayVoice={onPlayVoice}
          onStopVoice={onStopVoice}
        />
        <div ref={messagesEndRef} />
      </div>
      
      {isLoading && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-10 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg flex items-center space-x-3">
          <LoaderCircle className="h-5 w-5 text-blue-500 animate-spin" />
          <p className="text-sm font-medium">Processing your request...</p>
        </div>
      )}
      
      {mode !== 'history' && (
        <InputArea 
          mode={mode}
          input={input}
          isLoading={isLoading}
          hasVoiceSupport={hasVoiceSupport}
          isListening={isListening}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onStartListening={onStartListening}
          onStopListening={onStopListening}
        />
      )}
    </div>
  );
};

export default BaseChatInterface;
