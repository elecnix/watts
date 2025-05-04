import { useState, useEffect } from "react";
import LocationPermission from "@/components/LocationPermission";
import AudioPermission from "@/components/AudioPermission";
import SpeedDisplayComponent from "@/components/SpeedDisplay";
import useSpeed from "@/hooks/useSpeed";
import useAudio from "@/hooks/useAudio";

export default function SpeedDisplay() {
  const [locationPermissionGranted, setLocationPermissionGranted] = useState<boolean>(false);
  const [locationPermissionRequested, setLocationPermissionRequested] = useState<boolean>(false);
  const [audioPermissionGranted, setAudioPermissionGranted] = useState<boolean>(false);
  const [audioPermissionRequested, setAudioPermissionRequested] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  
  // Get speed data
  const { speed, error: speedError } = useSpeed(locationPermissionGranted);
  
  // Setup audio
  const { startAudio, stopAudio, playBeep, audioContext } = useAudio();
  
  // Check if permissions are already granted
  useEffect(() => {
    // Check for geolocation permissions
    if (navigator.geolocation) {
      navigator.permissions?.query({ name: 'geolocation' })
        .then((result) => {
          if (result.state === 'granted') {
            setLocationPermissionGranted(true);
            setLocationPermissionRequested(true);
          }
        })
        .catch(() => {
          // If checking permissions fails, we'll rely on the permission request flow
        });
    }
  }, []);
  
  // Handle audio permissions and setup
  useEffect(() => {
    if (locationPermissionGranted && audioPermissionGranted && audioEnabled) {
      startAudio();
    } else if (audioContext) {
      stopAudio();
    }
    
    return () => {
      if (audioContext) {
        stopAudio();
      }
    };
  }, [locationPermissionGranted, audioPermissionGranted, audioEnabled, startAudio, stopAudio, audioContext]);
  
  // Handle beep timing and frequency - REPLACED WITH DIRECT APPROACH
  useEffect(() => {
    if (!locationPermissionGranted || !audioPermissionGranted || !audioEnabled) return;
    
    console.log("Setting up NEW direct audio interval system");
    
    // Calculate frequency based on speed (linear mapping from 800Hz at 0 km/h to 3000Hz at 50 km/h)
    const getFrequency = (currentSpeed: number) => {
      const minFreq = 800;
      const maxFreq = 3000;
      const maxSpeed = 50;
      return currentSpeed === 0 ? minFreq : minFreq + (Math.min(currentSpeed, maxSpeed) / maxSpeed) * (maxFreq - minFreq);
    };
    
    // Function to create and play a beep directly (not using the hook)
    const createBeep = () => {
      try {
        const freq = getFrequency(speed);
        console.log(`Direct beep: Creating beep at ${freq}Hz for speed ${speed} km/h`);
        
        // Create context directly
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const context = new AudioContext();
        
        // Create nodes
        const oscillator = context.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.value = freq;
        
        const gainNode = context.createGain();
        gainNode.gain.value = 1.0; // Maximum volume
        
        // Connect and play
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        // Play for 200ms
        const now = context.currentTime;
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        
        console.log(`Direct beep: Playing at ${freq}Hz`);
      } catch (error) {
        console.error("Error creating direct beep:", error);
      }
    };
    
    // Create the first beep
    createBeep();
    
    // Set up interval for beeping every 2 seconds
    const interval = setInterval(createBeep, 2000);
    
    return () => clearInterval(interval);
  }, [locationPermissionGranted, audioPermissionGranted, audioEnabled, speed]);
  
  // Request location permission
  const requestLocationPermission = () => {
    setLocationPermissionRequested(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermissionGranted(true);
        },
        () => {
          // Permission denied or error
          setLocationPermissionGranted(false);
        }
      );
    } else {
      // Geolocation not supported
      setLocationPermissionGranted(false);
    }
  };
  
  // Request audio permission
  const requestAudioPermission = () => {
    setAudioPermissionRequested(true);
    
    // Create a temporary audio context to request permission
    const tempContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    if (tempContext.state === 'running') {
      setAudioPermissionGranted(true);
    } else {
      // In Safari/iOS, we need to play a silent sound to trigger the permission dialog
      const oscillator = tempContext.createOscillator();
      oscillator.connect(tempContext.destination);
      oscillator.start(0);
      oscillator.stop(0.001);
      
      // Check if context is running after the user interaction
      setTimeout(() => {
        if (tempContext.state === 'running') {
          setAudioPermissionGranted(true);
        }
        tempContext.close();
      }, 100);
    }
  };
  
  // Skip audio permission
  const skipAudioPermission = () => {
    setAudioPermissionRequested(true);
    setAudioPermissionGranted(false);
    setAudioEnabled(false);
  };
  
  // Toggle audio
  const toggleAudio = () => {
    if (!audioPermissionGranted && !audioEnabled) {
      // If audio was skipped before, request permission now
      requestAudioPermission();
    }
    setAudioEnabled(!audioEnabled);
  };
  
  return (
    <div className="min-h-screen flex flex-col px-6 pb-8 pt-12">
      {/* Location Permission Overlay */}
      {!locationPermissionRequested && (
        <LocationPermission onRequestPermission={requestLocationPermission} />
      )}
      
      {/* Audio Permission Overlay */}
      {locationPermissionGranted && !audioPermissionRequested && (
        <AudioPermission 
          onRequestPermission={requestAudioPermission}
          onSkipPermission={skipAudioPermission}
        />
      )}
      
      {/* Speed Display */}
      <SpeedDisplayComponent 
        speed={speed} 
        audioEnabled={audioEnabled && audioPermissionGranted}
        onToggleAudio={toggleAudio}
        error={speedError}
      />
    </div>
  );
}
