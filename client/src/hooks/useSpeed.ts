import { useState, useEffect } from 'react';

export default function useSpeed(locationPermissionGranted: boolean) {
  const [speed, setSpeed] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!locationPermissionGranted) return;
    
    let watchId: number;
    
    // Handle successful position updates
    const handlePositionUpdate = (position: GeolocationPosition) => {
      // Geolocation API returns speed in meters/second, convert to km/h
      if (position.coords.speed !== null) {
        const speedKmh = position.coords.speed * 3.6; // Convert m/s to km/h
        setSpeed(speedKmh);
        setError(null);
      } else {
        // Some devices don't provide speed directly
        // In a production app, you might calculate speed from position changes
        setError(new Error("Speed data not available from this device"));
      }
    };
    
    // Handle errors
    const handleError = (error: GeolocationPositionError) => {
      let errorMessage: string;
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location permission denied.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out.";
          break;
        default:
          errorMessage = "An unknown error occurred.";
      }
      
      setError(new Error(errorMessage));
    };
    
    try {
      // Watch position with high accuracy
      watchId = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } catch (err) {
      setError(new Error("Failed to initialize location tracking"));
    }
    
    // Clean up
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [locationPermissionGranted]);
  
  return { speed, error };
}
