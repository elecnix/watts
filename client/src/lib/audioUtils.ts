/**
 * Utility functions for working with Web Audio API
 */

// Linear mapping of a value from one range to another
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  // Ensure the value is within the input range
  const clampedValue = Math.max(inMin, Math.min(inMax, value));
  
  // Calculate the mapping
  return (
    ((clampedValue - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  );
}

// Create an audio context with fallback for Safari/iOS
export function createAudioContext(): AudioContext | null {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) {
      console.error("Web Audio API not supported in this browser");
      return null;
    }
    return new AudioContext();
  } catch (error) {
    console.error("Failed to create audio context:", error);
    return null;
  }
}

// Generate a sine wave tone
export function generateTone(
  context: AudioContext,
  frequency: number,
  duration: number,
  volume: number = 0.1
): void {
  // Create oscillator
  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  
  // Create gain node for volume
  const gainNode = context.createGain();
  gainNode.gain.value = 0.3; // Higher volume
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  // Start and stop
  const now = context.currentTime;
  oscillator.start(now);
  oscillator.stop(now + duration);
  
  // Fade out to avoid clicks
  gainNode.gain.linearRampToValueAtTime(volume, now + duration - 0.05);
  gainNode.gain.linearRampToValueAtTime(0, now + duration);
}
