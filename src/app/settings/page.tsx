import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface BotConfig {
  type: string;
  status: string;
  lastUpdated: string;
  settings: Record<string, any>;
}

export default function SettingsPage() {
  const [configs, setConfigs] = useState<Record<string, BotConfig>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        setConfigs(data.configs);
      } catch (error) {
        console.error('Error fetching configurations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfigs();
  }, []);

  const handleSaveConfig = async (type: string, settings: Record<string, any>) => {
    try {
      const response = await fetch('/api/configure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, settings }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success(`${type} bot configuration saved`);
        setConfigs(prev => ({
          ...prev,
          [type]: { ...prev[type], settings },
        }));
      } else {
        toast.error(data.message || 'Failed to save configuration');
      }
    } catch (error) {
      toast.error('Error saving configuration');
      console.error('Error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading configurations...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Bot Settings</h1>
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2">
        {Object.entries(configs).map(([type, config]) => (
          <Card key={type} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl text-white capitalize">{type} Bot Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const settings: Record<string, any> = {};
                  formData.forEach((value, key) => {
                    settings[key] = parseFloat(value as string) || value;
                  });
                  handleSaveConfig(type, settings);
                }}
                className="space-y-4 sm:space-y-6"
              >
                {type === 'arbitrage' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="minProfit" className="text-sm sm:text-base">Minimum Profit (ETH)</Label>
                      <Input
                        id="minProfit"
                        name="minProfit"
                        type="number"
                        step="0.01"
                        defaultValue={config.settings.minProfit}
                        className="bg-slate-700 border-slate-600 text-white text-sm sm:text-base h-9 sm:h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxGasPrice" className="text-sm sm:text-base">Maximum Gas Price (Gwei)</Label>
                      <Input
                        id="maxGasPrice"
                        name="maxGasPrice"
                        type="number"
                        step="1"
                        defaultValue={config.settings.maxGasPrice}
                        className="bg-slate-700 border-slate-600 text-white text-sm sm:text-base h-9 sm:h-10"
                      />
                    </div>
                  </>
                )}
                {type === 'liquidation' && (
                  <div className="space-y-2">
                    <Label htmlFor="healthFactorThreshold" className="text-sm sm:text-base">Health Factor Threshold</Label>
                    <Input
                      id="healthFactorThreshold"
                      name="healthFactorThreshold"
                      type="number"
                      step="0.01"
                      defaultValue={config.settings.healthFactorThreshold}
                      className="bg-slate-700 border-slate-600 text-white text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                )}
                {type === 'gas' && (
                  <div className="space-y-2">
                    <Label htmlFor="maxGasPrice" className="text-sm sm:text-base">Maximum Gas Price (Gwei)</Label>
                    <Input
                      id="maxGasPrice"
                      name="maxGasPrice"
                      type="number"
                      step="1"
                      defaultValue={config.settings.maxGasPrice}
                      className="bg-slate-700 border-slate-600 text-white text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-sm sm:text-base h-9 sm:h-10"
                >
                  Save Configuration
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 