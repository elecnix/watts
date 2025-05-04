import { Button } from "@/components/ui/button";

interface LocationPermissionProps {
  onRequestPermission: () => void;
}

export default function LocationPermission({ onRequestPermission }: LocationPermissionProps) {
  return (
    <div className="fixed inset-0 bg-background bg-opacity-95 z-50 flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-block w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Location Access Required</h2>
          <p className="text-secondary mb-8">To show your speed, we need access to your device's location services.</p>
        </div>
        <Button 
          className="w-full py-6 bg-primary hover:bg-primary/90 text-base rounded-lg font-medium mb-3"
          onClick={onRequestPermission}
        >
          Allow Location Access
        </Button>
        <p className="text-sm text-secondary">You can change this anytime in your device settings</p>
      </div>
    </div>
  );
}
