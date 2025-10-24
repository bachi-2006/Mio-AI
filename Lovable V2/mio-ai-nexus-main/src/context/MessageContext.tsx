import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message } from '@/types/message';
import { AIMode, useAIMode } from '@/hooks/useAIMode';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

type MessagesStore = {
  [key in AIMode]?: Message[];
};

interface MessageContextProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  clearMessages: (mode: AIMode) => void;
  saveMessage: (message: Message) => void;
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messagesStore, setMessagesStore] = useState<MessagesStore>({
    chat: [],
    code: [],
    image: [],
    voice: [],
    translate: [],
    history: []
  });
  const [currentMode, setCurrentMode] = useState<AIMode>('chat');
  const { user } = useAuth();

  useEffect(() => {
    const handleModeChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const modeParam = urlParams.get('mode') as AIMode | null;
      
      if (modeParam && ['chat', 'code', 'image', 'voice', 'translate', 'history'].includes(modeParam)) {
        setCurrentMode(modeParam);
      }
    };
    
    handleModeChange();
    window.addEventListener('popstate', handleModeChange);
    
    return () => {
      window.removeEventListener('popstate', handleModeChange);
    };
  }, []);

  useEffect(() => {
    if (user?.email) {
      const loadFromLocalStorage = () => {
        Object.keys(messagesStore).forEach(mode => {
          const storedMessages = localStorage.getItem(`mio_messages_${mode}_${user.email}`);
          if (storedMessages) {
            try {
              const parsedMessages = JSON.parse(storedMessages);
              setMessagesStore(prev => ({
                ...prev,
                [mode]: parsedMessages
              }));
            } catch (error) {
              console.error(`Failed to parse stored messages for ${mode}`, error);
            }
          }
        });
      };
      
      const loadFromSupabase = async () => {
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('user_id', user.email)
            .order('timestamp', { ascending: true });
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            console.log(`Loaded ${data.length} messages from Supabase`);
            
            const messagesByMode: MessagesStore = {};
            
            data.forEach(msg => {
              const message: Message = {
                id: msg.id,
                content: msg.content,
                sender: msg.sender as 'user' | 'ai',
                timestamp: new Date(msg.timestamp),
                mode: msg.mode as AIMode,
                imageUrl: msg.image_url || undefined
              };
              
              if (!messagesByMode[message.mode as AIMode]) {
                messagesByMode[message.mode as AIMode] = [];
              }
              
              messagesByMode[message.mode as AIMode]?.push(message);
            });
            
            setMessagesStore(prev => ({
              ...prev,
              ...messagesByMode
            }));
            
            Object.entries(messagesByMode).forEach(([mode, msgs]) => {
              localStorage.setItem(`mio_messages_${mode}_${user.email}`, JSON.stringify(msgs));
            });
          }
        } catch (error) {
          console.error('Error loading messages from Supabase', error);
          loadFromLocalStorage();
        }
      };
      
      loadFromLocalStorage();
      loadFromSupabase();
    }
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      Object.entries(messagesStore).forEach(([mode, messages]) => {
        if (messages && messages.length > 0) {
          localStorage.setItem(`mio_messages_${mode}_${user.email}`, JSON.stringify(messages));
        }
      });
    }
  }, [messagesStore, user]);

  useEffect(() => {
    if (!user?.email) return;
    
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `user_id=eq.${user.email}` },
        (payload: any) => {
          const newMessage: Message = {
            id: payload.new.id,
            content: payload.new.content,
            sender: payload.new.sender as 'user' | 'ai',
            timestamp: new Date(payload.new.timestamp),
            mode: payload.new.mode as AIMode,
            imageUrl: payload.new.image_url || undefined
          };
          
          setMessagesStore(prev => {
            const existingMessages = prev[newMessage.mode] || [];
            if (!existingMessages.find(msg => msg.id === newMessage.id)) {
              return {
                ...prev,
                [newMessage.mode]: [...existingMessages, newMessage]
              };
            }
            return prev;
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getCurrentMessages = (): Message[] => {
    const allMessages: Message[] = [];
    Object.values(messagesStore).forEach(messages => {
      if (messages) allMessages.push(...messages);
    });
    return allMessages;
  };

  const setCurrentMessages = (messages: React.SetStateAction<Message[]>) => {
    console.log("Setting current messages is not supported in this implementation.");
    // This function is maintained for compatibility but doesn't do anything
    // as we now store messages by mode in messagesStore
  };

  const clearMessages = (mode: AIMode) => {
    setMessagesStore(prev => ({
      ...prev,
      [mode]: []
    }));
    
    if (user?.email) {
      localStorage.removeItem(`mio_messages_${mode}_${user.email}`);
      
      supabase
        .from('messages')
        .delete()
        .eq('user_id', user.email)
        .eq('mode', mode)
        .then(({ error }) => {
          if (error) console.error(`Error clearing messages for ${mode} mode:`, error);
        });
    }
  };

  const saveToSupabase = async (message: Message) => {
    if (!user) return;
    
    try {
      const timestamp = message.timestamp instanceof Date 
        ? message.timestamp.toISOString() 
        : typeof message.timestamp === 'string'
          ? message.timestamp
          : new Date().toISOString();
      
      const { error } = await supabase
        .from('messages')
        .insert({
          id: message.id,
          user_id: user.email,
          content: message.content,
          sender: message.sender,
          mode: message.mode,
          timestamp: timestamp,
          image_url: message.imageUrl || null
        });
      
      if (error) {
        console.error('Error saving message to Supabase:', error);
      }
    } catch (error) {
      console.error('Error in saveToSupabase:', error);
    }
  };

  const saveMessage = (message: Message) => {
    const { mode } = message;
    
    console.log("Saving message for mode:", mode, message);
    
    setMessagesStore(prev => {
      const updated = {
        ...prev,
        [mode]: [...(prev[mode] || []), message]
      };
      console.log("Updated message store:", updated);
      return updated;
    });
    
    if (user?.email) {
      const modeMessages = [...(messagesStore[mode] || []), message];
      localStorage.setItem(`mio_messages_${mode}_${user.email}`, JSON.stringify(modeMessages));
      
      if (message.sender) {
        saveToSupabase(message);
      }
    }
  };

  return (
    <MessageContext.Provider 
      value={{
        messages: getCurrentMessages(),
        setMessages: setCurrentMessages,
        clearMessages,
        saveMessage
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
