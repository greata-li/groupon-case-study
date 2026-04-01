import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

/**
 * Voice dictation button using the Web Speech API.
 * Falls back gracefully if the browser doesn't support it.
 */
export function VoiceInput({ onTranscript, className }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    if (!supported) return;

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      if (transcript.trim()) {
        onTranscript(transcript.trim());
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [supported, onTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }, []);

  if (!supported) return null;

  return (
    <Button
      type="button"
      variant={listening ? 'default' : 'outline'}
      size="sm"
      onClick={listening ? stopListening : startListening}
      className={`gap-1.5 ${listening ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' : ''} ${className ?? ''}`}
    >
      {listening ? (
        <>
          <MicOff className="h-3.5 w-3.5" />
          Stop
        </>
      ) : (
        <>
          <Mic className="h-3.5 w-3.5" />
          Voice
        </>
      )}
    </Button>
  );
}
