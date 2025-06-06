import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';

export function BotControls() {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartBots = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/start-bots', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('All bots started successfully');
      } else {
        toast.error(data.message || 'Failed to start bots');
      }
    } catch (error) {
      toast.error('Error starting bots');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseBots = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/pause-bots', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('All bots paused successfully');
      } else {
        toast.error(data.message || 'Failed to pause bots');
      }
    } catch (error) {
      toast.error('Error pausing bots');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <Button
        onClick={handleStartBots}
        disabled={isLoading}
        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
      >
        <PlayCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        Start All Bots
      </Button>
      <Button
        onClick={handlePauseBots}
        disabled={isLoading}
        className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
      >
        <PauseCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        Pause All Bots
      </Button>
    </div>
  );
} 