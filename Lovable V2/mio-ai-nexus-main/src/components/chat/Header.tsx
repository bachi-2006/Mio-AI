import React from 'react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIMode } from '@/hooks/useAIMode';
import { Button } from '@/components/ui/button';
import { Sliders, X } from 'lucide-react';
import { motion } from 'framer-motion';

// Voice settings interface
interface VoiceSettings {
  selectedVoice: string;
  availableVoices: SpeechSynthesisVoice[];
  voiceRate: number;
  voicePitch: number;
  isAutoPlayVoice: boolean;
  onVoiceChange: (voice: string) => void;
  onRateChange: (rate: number) => void;
  onPitchChange: (pitch: number) => void;
  onAutoPlayChange: () => void;
  onTestVoice: () => void;
}

interface HeaderProps {
  mode: AIMode;
  showVoiceSettings: boolean;
  onVoiceSettingsChange: (show: boolean) => void;
  voiceProps?: VoiceSettings;
}

const Header: React.FC<HeaderProps> = ({
  mode,
  showVoiceSettings,
  onVoiceSettingsChange,
  voiceProps
}) => {
  const isVoiceMode = mode === 'voice';

  // Filter for Google US English voice
  const getDefaultVoice = () => {
    if (!voiceProps?.availableVoices) return null;
    
    // First try to find Google US English
    const googleUSVoice = voiceProps.availableVoices.find(
      voice => voice.name.includes('Google US English') || 
               (voice.name.toLowerCase().includes('google') && 
                voice.lang.startsWith('en-US'))
    );
    
    if (googleUSVoice) return googleUSVoice;
    
    // Fall back to any US English voice
    const usVoice = voiceProps.availableVoices.find(voice => voice.lang === 'en-US');
    if (usVoice) return usVoice;
    
    // Last resort - any English voice
    return voiceProps.availableVoices.find(voice => voice.lang.startsWith('en'));
  };

  // Set the default voice if one isn't already selected
  React.useEffect(() => {
    if (isVoiceMode && voiceProps && !voiceProps.selectedVoice) {
      const defaultVoice = getDefaultVoice();
      if (defaultVoice) {
        voiceProps.onVoiceChange(defaultVoice.name);
      }
    }
  }, [isVoiceMode, voiceProps?.availableVoices]);

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mr-4">
          Mio AI
        </h1>
        {isVoiceMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVoiceSettingsChange(!showVoiceSettings)}
            className="flex items-center gap-2"
          >
            <Sliders className="h-4 w-4" />
            <span>Voice Settings</span>
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
      </div>

      {/* Voice Settings Panel */}
      {isVoiceMode && showVoiceSettings && voiceProps && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 z-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-lg text-gray-800 dark:text-gray-100">Voice Settings</h2>
            <Button variant="ghost" size="icon" onClick={() => onVoiceSettingsChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Voice</label>
              <select 
                className="w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
                value={voiceProps.selectedVoice || ''}
                onChange={(e) => {
                  voiceProps.onVoiceChange(e.target.value);
                }}
              >
                {voiceProps.availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rate: {voiceProps.voiceRate.toFixed(1)}
              </label>
              <input 
                type="range" 
                min="0.1" 
                max="2" 
                step="0.1" 
                value={voiceProps.voiceRate} 
                onChange={(e) => voiceProps.onRateChange(parseFloat(e.target.value))} 
                className="w-full mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pitch: {voiceProps.voicePitch.toFixed(1)}
              </label>
              <input 
                type="range" 
                min="0.1" 
                max="2" 
                step="0.1" 
                value={voiceProps.voicePitch} 
                onChange={(e) => voiceProps.onPitchChange(parseFloat(e.target.value))} 
                className="w-full mt-1"
              />
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="autoplay" 
                checked={voiceProps.isAutoPlayVoice} 
                onChange={voiceProps.onAutoPlayChange} 
                className="mr-2"
              />
              <label htmlFor="autoplay" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-play responses
              </label>
            </div>

            <Button onClick={voiceProps.onTestVoice} className="w-full">
              Test Voice
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Header;
