
import { useState } from 'react';

export type AIMode = 'chat' | 'code' | 'image' | 'voice' | 'translate' | 'history';

export const useAIMode = () => {
  const [mode, setMode] = useState<AIMode>('chat');

  return {
    mode,
    setMode,
  };
};
