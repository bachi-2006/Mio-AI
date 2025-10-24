
import React, { useState } from 'react';
import BaseChatInterface from './BaseChatInterface';
import { Button } from '@/components/ui/button';
import { generateImage } from '@/services/runwareService';
import { useMessages } from '@/context/MessageContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ImageModeInterfaceProps {
  mode: 'image';
}

const ImageModeInterface: React.FC<ImageModeInterfaceProps> = (props) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { saveMessage } = useMessages();

  const handleGenerateImage = async (prompt: string) => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    toast.info('Generating image...');
    
    try {
      // Save user's prompt as a message
      saveMessage({
        id: Date.now().toString(),
        content: prompt,
        sender: 'user',
        timestamp: new Date(),
        mode: 'image'
      });
      
      const result = await generateImage({ positivePrompt: prompt });
      
      if (result && result.imageURL) {
        // Save the generated image as a response
        saveMessage({
          id: Date.now().toString(),
          content: `Generated image based on: "${prompt}"`,
          sender: 'ai',
          timestamp: new Date(),
          mode: 'image',
          imageUrl: result.imageURL
        });
        
        toast.success('Image generated successfully');
      } else {
        throw new Error('Failed to generate image');
      }
    } catch (error) {
      console.error('Image generation error:', error);
      toast.error('Failed to generate image. Please try again.');
      
      // Save error message
      saveMessage({
        id: Date.now().toString(),
        content: 'Sorry, I was unable to generate that image. Please try a different description.',
        sender: 'ai',
        timestamp: new Date(),
        mode: 'image'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full">
      <div className="mb-4 px-4">
        <h1 className="text-2xl font-bold">Image Generation</h1>
        <p className="text-muted-foreground">Describe the image you want to generate, and I'll create it for you.</p>
      </div>
      {isGenerating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-lg font-medium">Creating your image...</p>
            <p className="text-sm text-muted-foreground mt-2">This may take a few seconds</p>
          </div>
        </div>
      )}
      <BaseChatInterface 
        {...props} 
        onCustomSubmit={handleGenerateImage}
      />
    </div>
  );
};

export default ImageModeInterface;
