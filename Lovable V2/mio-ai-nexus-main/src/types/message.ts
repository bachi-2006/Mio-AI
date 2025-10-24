
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  mode: 'chat' | 'code' | 'image' | 'voice' | 'translate' | 'history';
  imageUrl?: string;
}
