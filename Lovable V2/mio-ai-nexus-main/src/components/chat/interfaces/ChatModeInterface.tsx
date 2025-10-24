
import React from 'react';
import BaseChatInterface from './BaseChatInterface';

interface ChatModeInterfaceProps {
  mode: 'chat';
  hasVoiceSupport?: boolean;
  onPlayVoice?: (text: string) => void;
  onStopVoice?: () => void;
}

const ChatModeInterface: React.FC<ChatModeInterfaceProps> = (props) => {
  return (
    <div className="h-full">
      <div className="mb-4 px-4">
        <h1 className="text-2xl font-bold">Chat Mode</h1>
        <p className="text-muted-foreground">Ask any questions or have a conversation with the AI.</p>
      </div>
      <BaseChatInterface {...props} />
    </div>
  );
};

export default ChatModeInterface;
