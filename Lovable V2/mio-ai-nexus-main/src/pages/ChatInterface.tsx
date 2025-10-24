
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AIMode, useAIMode } from '@/hooks/useAIMode';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageProvider, useMessages } from '@/context/MessageContext';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/chat/Sidebar';
import Header from '@/components/chat/Header';
import HistoryView from '@/components/HistoryView';
import ChatModeInterface from '@/components/chat/interfaces/ChatModeInterface';
import CodeModeInterface from '@/components/chat/interfaces/CodeModeInterface';
import ImageModeInterface from '@/components/chat/interfaces/ImageModeInterface';
import VoiceModeInterface from '@/components/chat/interfaces/VoiceModeInterface';
import TranslateModeInterface from '@/components/chat/interfaces/TranslateModeInterface';

const ChatInterfaceContent: React.FC = () => {
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isAutoPlayVoice, setIsAutoPlayVoice] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const { mode, setMode } = useAIMode();
  const { isDarkMode } = useTheme();
  
  const [voiceRate, setVoiceRate] = useState<number>(1);
  const [voicePitch, setVoicePitch] = useState<number>(1);
  const { messages, clearMessages } = useMessages();
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening,
    hasVoiceSupport,
    speakText,
    availableVoices,
    selectedVoice,
    changeVoice
  } = useVoiceInput({
    rate: voiceRate,
    pitch: voicePitch
  });

  useEffect(() => {
    // Fetch messages from Supabase when the component mounts or mode changes
    const fetchMessages = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.email)
          .eq('mode', mode)
          .order('timestamp', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log(`Loaded ${data.length} messages from Supabase for ${mode} mode`);
        }
      } catch (error) {
        console.error('Error fetching messages from Supabase:', error);
      }
    };
    
    fetchMessages();
  }, [user, mode]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      logout(); // Fallback to local logout
      navigate('/');
    }
  };

  const handleModeChange = (newMode: AIMode) => {
    setMode(newMode);
  };

  const handlePlayVoice = (text: string) => {
    if (speakText(text)) {
      toast.success('Playing audio response');
    } else {
      toast.error('Text-to-speech is not supported in your browser');
    }
  };

  const handleStopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      toast.success('Audio playback stopped');
    }
  };

  const handleClearHistory = () => {
    clearMessages(mode);
    toast.success(`Cleared all ${mode} messages`);
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-950 overflow-hidden">
      <Sidebar 
        mode={mode} 
        onModeChange={handleModeChange}
        onLogout={handleLogout}
        onClearHistory={handleClearHistory}
        user={user}
      />
      
      <div className="flex-1 flex flex-col w-full h-full">
        <Header 
          mode={mode}
          showVoiceSettings={showVoiceSettings}
          onVoiceSettingsChange={setShowVoiceSettings}
          voiceProps={mode === 'voice' ? {
            selectedVoice,
            availableVoices,
            voiceRate,
            voicePitch,
            isAutoPlayVoice,
            onVoiceChange: changeVoice,
            onRateChange: setVoiceRate,
            onPitchChange: setVoicePitch,
            onAutoPlayChange: () => setIsAutoPlayVoice(!isAutoPlayVoice),
            onTestVoice: () => speakText("Hello! This is a test of the voice settings you've chosen.")
          } : undefined}
        />
        
        <div className="flex-1 overflow-hidden relative w-full">
          <AnimatePresence mode="wait">
            <motion.div 
              key={mode}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {mode === 'chat' && (
                <ChatModeInterface 
                  mode="chat"
                  hasVoiceSupport={hasVoiceSupport}
                  onPlayVoice={handlePlayVoice}
                  onStopVoice={handleStopVoice}
                />
              )}
              
              {mode === 'code' && <CodeModeInterface mode="code" />}
              
              {mode === 'image' && <ImageModeInterface mode="image" />}
              
              {mode === 'voice' && (
                <VoiceModeInterface 
                  mode="voice"
                  hasVoiceSupport={hasVoiceSupport}
                  isListening={isListening}
                  onStartListening={startListening}
                  onStopListening={stopListening}
                  onPlayVoice={handlePlayVoice}
                  onStopVoice={handleStopVoice}
                  isAutoPlayVoice={isAutoPlayVoice}
                />
              )}
              
              {mode === 'translate' && <TranslateModeInterface mode="translate" />}
              
              {mode === 'history' && <HistoryView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ChatInterface: React.FC = () => {
  return (
    <MessageProvider>
      <ChatInterfaceContent />
    </MessageProvider>
  );
};

export default ChatInterface;
