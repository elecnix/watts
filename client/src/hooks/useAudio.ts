import { useState, useCallback, useRef } from 'react';

export default function useAudio() {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize audio context
  const startAudio = useCallback(() => {
    if (audioInitialized && audioContextRef.current) return;
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.error("Web Audio API not supported in this browser");
        return;
      }
      
      // Create a new audio context
      audioContextRef.current = new AudioContext();
      
      // Play a silent sound to ensure audio context is running
      const oscillator = audioContextRef.current.createOscillator();
      oscillator.connect(audioContextRef.current.destination);
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.001);
      
      console.log("Audio context initialized with state:", audioContextRef.current.state);
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
    // Try to initialize audio context if it's not already initialized
    if (!audioContextRef.current) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        setAudioInitialized(true);
      } catch (error) {
        console.error("Failed to initialize audio context:", error);
        return;
      }
    }
    
    try {
      const context = audioContextRef.current;
      
      // Create oscillator with square wave for more audible beep
      // Test beep has been removed since we now have a manual test button
      
      // Create the main oscillator
      const oscillator = context.createOscillator();
      oscillator.type = 'square'; // Square wave is more audible than sine
      oscillator.frequency.value = frequency;
      
      // Create gain node with maximum volume
      const gainNode = context.createGain();
      gainNode.gain.value = 1.0; // Maximum volume
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      // Start and stop the oscillator
      const now = context.currentTime;
      oscillator.start(now);
      oscillator.stop(now + duration);
      
      console.log(`Playing beep at ${frequency}Hz for ${duration}s at maximum volume`);
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
