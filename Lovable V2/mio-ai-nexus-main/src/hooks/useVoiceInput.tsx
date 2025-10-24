
import { useState, useEffect } from 'react';
import 'regenerator-runtime/runtime';

interface SpeechRecognition extends EventTarget {
  start: () => void;
  stop: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

interface VoiceOptions {
  lang?: string;
  continuous?: boolean;
  pitch?: number;
  rate?: number;
  voice?: string;
}

interface UseVoiceInputProps {
  rate?: number;
  pitch?: number;
  lang?: string;
  continuous?: boolean;
  voice?: string;
}

export const useVoiceInput = ({ 
  rate = 1, 
  pitch = 1, 
  lang = 'en-US', 
  continuous = false, 
  voice = ''
}: UseVoiceInputProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasVoiceSupport, setHasVoiceSupport] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceObj, setSelectedVoiceObj] = useState<SpeechSynthesisVoice | null>(null);

  // Define options using the props
  const voiceOptions: VoiceOptions = {
    lang,
    continuous,
    pitch,
    rate,
    voice
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setHasVoiceSupport(true);
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = voiceOptions.continuous || false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = voiceOptions.lang || 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }

    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // First try to find the specified voice
        if (voiceOptions.voice) {
          const requestedVoice = voices.find(v => v.name === voiceOptions.voice);
          if (requestedVoice) {
            setSelectedVoiceObj(requestedVoice);
            return;
          }
        }
        
        // Then try Google US English
        const googleUSVoice = voices.find(voice => 
          voice.name === 'Google US English' || 
          voice.name.includes('Google US English')
        );
        
        if (googleUSVoice) {
          setSelectedVoiceObj(googleUSVoice);
        } else {
          // Then any US English voice
          const usVoice = voices.find(voice => 
            voice.lang.includes('en-US')
          );
          
          if (usVoice) {
            setSelectedVoiceObj(usVoice);
          } else if (voices.length > 0) {
            // Fallback to first available voice
            setSelectedVoiceObj(voices[0]);
          }
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [voiceOptions.continuous, voiceOptions.lang, voiceOptions.voice]);

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const changeVoice = (voiceName: string) => {
    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === voiceName);
      if (voice) {
        setSelectedVoiceObj(voice);
        return true;
      }
    }
    return false;
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (selectedVoiceObj) {
        utterance.voice = selectedVoiceObj;
      }
      
      utterance.rate = voiceOptions.rate || 1;
      utterance.pitch = voiceOptions.pitch || 1;
      
      window.speechSynthesis.speak(utterance);
      return true;
    }
    return false;
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasVoiceSupport,
    availableVoices,
    selectedVoice: selectedVoiceObj?.name || '',
    selectedVoiceObj,
    changeVoice,
    speakText
  };
};
