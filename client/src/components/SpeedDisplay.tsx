import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SpeedDisplayProps {
  speed: number;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  error?: Error | null;
}

export default function SpeedDisplay({ 
  speed, 
  audioEnabled, 
  onToggleAudio,
  error
}: SpeedDisplayProps) {
  const [countdownToBeep, setCountdownToBeep] = useState<number>(2);
  
  // Countdown timer for next beep
  useEffect(() => {
    if (!audioEnabled) return;
    
    const interval = setInterval(() => {
      setCountdownToBeep(prev => {
        if (prev <= 1) {
          // Reset to 2 when reaching 0
          return 2;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [audioEnabled]);
  
  // Flash effect when beep happens
  const isBeeping = countdownToBeep === 2;
  
  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Speed display */}
        <div className="text-center mb-6">
          <div className="mb-2 text-secondary text-lg">Current Speed</div>
          <div className="flex items-baseline justify-center">
            <span className="text-[72px] font-semibold tracking-tight">
              {error ? "--" : Math.round(speed)}
            </span>
            <span className="text-2xl ml-2 text-secondary">km/h</span>
          </div>
        </div>
        
        {/* Audio feedback indicator */}
        <div className={`flex items-center space-x-2 ${audioEnabled ? 'opacity-70' : 'opacity-30'}`}>
          <span className="inline-flex items-center justify-center">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m-3.536-9.9a3 3 0 010 4.243m-4.95-4.243a1 1 0 010 1.414l4.243 4.243-4.243 4.243a1 1 0 01-1.414-1.414"></path>
            </svg>
          </span>
          <span className={`text-sm ${isBeeping && audioEnabled ? 'text-primary' : 'text-secondary'} transition-colors duration-300`}>
            {audioEnabled ? `Next tone in ${countdownToBeep}s` : 'Audio disabled'}
          </span>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mt-4 text-destructive text-sm text-center">
            {error.message}
          </div>
        )}
      </div>
      
      {/* Audio toggle button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={onToggleAudio}
          variant="ghost"
          className="flex items-center px-4 py-2 rounded-full bg-secondary/20 hover:bg-secondary/30 text-sm"
        >
          <span className="mr-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {audioEnabled ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 0l-4.243-4.243a1 1 0 00-1.414 0L8.414 8.464"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15.536a5 5 0 010-7.072m12.728 0l-4.243-4.243a1 1 0 00-1.414 0L8.414 8.464 4.172 12.707a1 1 0 00-.222.307M19 14l-3.536-3.536M5 10l3.536 3.536"></path>
              )}
            </svg>
          </span>
          <span>{audioEnabled ? 'Audio On' : 'Audio Off'}</span>
        </Button>
      </div>
    </>
  );
}
