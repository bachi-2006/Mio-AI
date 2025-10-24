import React, { useState, useEffect } from 'react';
import { ChatHistory, getUserHistory } from '@/services/databaseService';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Search, Calendar, Code, MessageCircle, Image, Mic, ArrowRight } from 'lucide-react';
import { Translate } from '@/components/icons/Translate';
import Loader from '@/components/Loader';

const HistoryView: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [filteredHistory, setFilteredHistory] = useState<ChatHistory[]>([]);
  
  useEffect(() => {
    if (user) {
      const userHistory = getUserHistory(user.email);
      // Sort history by timestamp descending (newest first)
      const sortedHistory = [...userHistory].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setHistory(sortedHistory);
      setFilteredHistory(sortedHistory);
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (history.length === 0) return;
    
    let filtered = [...history];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.response.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by mode
    if (selectedMode) {
      filtered = filtered.filter(item => item.mode === selectedMode);
    }
    
    setFilteredHistory(filtered);
  }, [searchQuery, selectedMode, history]);
  
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'chat': return <MessageCircle size={16} />;
      case 'code': return <Code size={16} />;
      case 'image': return <Image size={16} />;
      case 'voice': return <Mic size={16} />;
      case 'translate': return <Translate />;
      default: return <MessageCircle size={16} />;
    }
  };
  
  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'chat': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'code': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'image': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'voice': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'translate': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };
  
  const groupHistoryByDate = (history: ChatHistory[]) => {
    const groups: Record<string, ChatHistory[]> = {};
    
    history.forEach(item => {
      const date = format(new Date(item.timestamp), 'MMM dd, yyyy');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    
    return groups;
  };
  
  const groupedHistory = groupHistoryByDate(filteredHistory);
  
  if (isLoading) {
    return <Loader text="Loading your history..." />;
  }
  
  if (history.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">No history yet</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Start a conversation with Mio AI to see your history here.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search your history..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedMode === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMode(null)}
          >
            All
          </Button>
          <Button 
            variant={selectedMode === 'chat' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMode(selectedMode === 'chat' ? null : 'chat')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </Button>
          <Button 
            variant={selectedMode === 'code' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMode(selectedMode === 'code' ? null : 'code')}
          >
            <Code className="h-4 w-4 mr-2" />
            Code
          </Button>
          <Button 
            variant={selectedMode === 'image' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMode(selectedMode === 'image' ? null : 'image')}
          >
            <Image className="h-4 w-4 mr-2" />
            Image
          </Button>
          <Button 
            variant={selectedMode === 'voice' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMode(selectedMode === 'voice' ? null : 'voice')}
          >
            <Mic className="h-4 w-4 mr-2" />
            Voice
          </Button>
          <Button 
            variant={selectedMode === 'translate' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMode(selectedMode === 'translate' ? null : 'translate')}
          >
            <Translate className="h-4 w-4 mr-2" />
            Translate
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-10">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">No matching history</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          Object.entries(groupedHistory).map(([date, items]) => (
            <div key={date} className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 sticky top-0 bg-gray-50 dark:bg-gray-900 py-1">
                {date}
              </h3>
              
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="border-b border-gray-100 dark:border-gray-800 p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getModeColor(item.mode)}`}>
                          {getModeIcon(item.mode)}
                          <span className="ml-1 capitalize">{item.mode}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(item.timestamp), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Your message:</h4>
                        <p className="text-sm bg-blue-50 dark:bg-gray-700 p-2 rounded-md">{item.message}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Mio's response:</h4>
                        {item.imageUrl ? (
                          <div>
                            <p className="text-sm mb-2">{item.response}</p>
                            <img 
                              src={item.imageUrl} 
                              alt="Generated" 
                              className="rounded-md max-w-full max-h-44 object-cover" 
                            />
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap line-clamp-3">
                            {item.response}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-2 text-right">
                      <Button variant="ghost" size="sm">
                        <span className="mr-1">Continue this conversation</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryView;
