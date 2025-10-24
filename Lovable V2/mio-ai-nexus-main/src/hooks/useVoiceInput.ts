
import { useState, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface UseVoiceInputProps {
  rate?: number;
  pitch?: number;
}

export const useVoiceInput = ({ rate = 1, pitch = 1 }: UseVoiceInputProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // Try to find and set a good default voice
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Google US English') || 
          (voice.name.toLowerCase().includes('google') && voice.lang === 'en-US') ||
          voice.name.includes('Samantha') || // macOS voice
          (voice.lang === 'en-US' && voice.name.includes('Female')) ||
          voice.lang === 'en-US'
        );
        
        if (preferredVoice && !selectedVoice) {
          setSelectedVoice(preferredVoice.name);
        } else if (voices.length > 0 && !selectedVoice) {
          setSelectedVoice(voices[0].name);
        }
      }
    };

    loadVoices();

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Start listening
  const startListening = () => {
    if (browserSupportsSpeechRecognition) {
      setIsListening(true);
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: 'en-US'
      });
    }
  };

  // Stop listening
  const stopListening = () => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    }
  };

  // Text to speech
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set selected voice if available
      if (selectedVoice) {
        const voice = availableVoices.find(v => v.name === selectedVoice);
        if (voice) {
          utterance.voice = voice;
        }
      }
      
      // Set rate and pitch
      utterance.rate = rate;
      utterance.pitch = pitch;
      
      window.speechSynthesis.speak(utterance);
      return true;
    }
    return false;
  };

  // Change voice
  const changeVoice = (voiceName: string) => {
    setSelectedVoice(voiceName);
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasVoiceSupport: browserSupportsSpeechRecognition,
    speakText,
    availableVoices,
    selectedVoice,
    changeVoice
  };
};
