import { Button } from "@/components/ui/button";

interface AudioPermissionProps {
  onRequestPermission: () => void;
  onSkipPermission: () => void;
}

export default function AudioPermission({ onRequestPermission, onSkipPermission }: AudioPermissionProps) {
  return (
    <div className="fixed inset-0 bg-background bg-opacity-95 z-50 flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-block w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 0l-4.243-4.243a1 1 0 00-1.414 0L8.414 8.464"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Audio Feedback</h2>
          <p className="text-secondary mb-8">Allow audio to receive speed-based sound feedback every 10 seconds.</p>
        </div>
        <Button 
          className="w-full py-6 bg-primary hover:bg-primary/90 text-base rounded-lg font-medium mb-3"
          onClick={onRequestPermission}
        >
          Enable Audio
        </Button>
        <Button 
          className="w-full py-6 border border-secondary/30 hover:bg-secondary/10 rounded-lg font-medium text-primary bg-transparent"
          onClick={onSkipPermission}
        >
          Continue Without Audio
        </Button>
      </div>
    </div>
  );
}
