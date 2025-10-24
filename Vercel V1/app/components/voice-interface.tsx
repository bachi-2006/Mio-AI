import { useState } from 'react'
import { Button } from "@/components/ui/button"

interface VoiceInterfaceProps {
  apiKey: string
}

export function VoiceInterface({ apiKey }: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false)

  const toggleListening = () => {
    setIsListening(!isListening)
    // Here you would typically start/stop voice recognition
    // and process the results using the Gemini API
  }

  return (
    <Button 
      onClick={toggleListening} 
      className={`mt-4 ${isListening ? 'bg-gold-500 text-black' : 'bg-red-500 text-white'} hover:bg-red-600`}
    >
      {isListening ? 'Stop Listening' : 'Start Listening'}
    </Button>
  )
}
