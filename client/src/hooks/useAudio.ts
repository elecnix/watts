import { useState, useCallback, useRef } from 'react';

export default function useAudio() {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize audio context
  const startAudio = useCallback(() => {
    if (audioInitialized) return;
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.error("Web Audio API not supported in this browser");
        return;
      }
      
      audioContextRef.current = new AudioContext();
      setAudioInitialized(true);
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
    }
  }, [audioInitialized]);
  
  // Stop and clean up audio context
  const stopAudio = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      setAudioInitialized(false);
    }
  }, []);
  
  // Play a beep with the given frequency
  const playBeep = useCallback((frequency: number, duration: number) => {
    if (!audioContextRef.current) return;
    
    try {
      const context = audioContextRef.current;
      
      // Create oscillator
      const oscillator = context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      // Create gain node for volume control
      const gainNode = context.createGain();
      gainNode.gain.value = 0.1; // Keep volume low
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      // Start and stop the oscillator
      const now = context.currentTime;
      oscillator.start(now);
      oscillator.stop(now + duration);
      
      // Apply fade out to avoid clicks
      gainNode.gain.linearRampToValueAtTime(0.1, now + duration - 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);
    } catch (error) {
      console.error("Error playing beep:", error);
    }
  }, []);
  
  return {
    startAudio,
    stopAudio,
    playBeep,
    audioContext: audioContextRef.current
  };
}
