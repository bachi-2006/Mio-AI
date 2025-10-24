
import React from 'react';
import BaseChatInterface from './BaseChatInterface';

interface VoiceModeInterfaceProps {
  mode: 'voice';
  hasVoiceSupport: boolean;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onPlayVoice: (text: string) => void;
  onStopVoice: () => void;
  isAutoPlayVoice: boolean;
}

const VoiceModeInterface: React.FC<VoiceModeInterfaceProps> = (props) => {
  return (
    <div className="h-full">
      <div className="mb-4 px-4">
        <h1 className="text-2xl font-bold">Voice Assistant</h1>
        <p className="text-muted-foreground">Speak to the AI assistant and get spoken responses. Click the microphone to start.</p>
      </div>
      <BaseChatInterface {...props} />
    </div>
  );
};

export default VoiceModeInterface;
