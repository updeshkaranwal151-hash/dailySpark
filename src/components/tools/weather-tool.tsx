
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Thermometer, Wind, Droplets, Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';
import { getWeather, GetWeatherOutput } from '@/ai/flows/ai-weather-tool';
import { Skeleton } from '../ui/skeleton';

const WeatherIcon = ({ condition, className }: { condition: string; className?: string }) => {
  const lowerCaseCondition = condition.toLowerCase();
  if (lowerCaseCondition.includes('sun') || lowerCaseCondition.includes('clear')) {
    return <Sun className={className} />;
  }
  if (lowerCaseCondition.includes('cloud')) {
    return <Cloud className={className} />;
  }
  if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) {
    return <CloudRain className={className} />;
  }
  if (lowerCaseCondition.includes('snow')) {
    return <Snowflake className={className} />;
  }
  return <Cloud className={className} />;
};


export default function WeatherTool() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<GetWeatherOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetWeather = async () => {
    if (!city.trim()) {
      toast({
        title: 'City is empty',
        description: 'Please enter a city name to get the weather.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setWeather(null);
    try {
      const result = await getWeather({ city });
      setWeather(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error fetching weather',
        description: 'Could not retrieve weather data for that city. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Enter city name, e.g., 'London'"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleGetWeather()}
        />
        <Button onClick={handleGetWeather} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
          <span className="ml-2 hidden sm:inline">Get Weather</span>
        </Button>
      </div>

      {isLoading && (
         <Card className="w-full">
            <CardHeader className="text-center">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                 <Skeleton className="h-20 w-20 rounded-full" />
                 <Skeleton className="h-10 w-24" />
                <div className="grid grid-cols-3 gap-4 text-center text-sm w-full pt-4">
                    <div>
                        <Skeleton className="h-5 w-16 mx-auto mb-1" />
                        <Skeleton className="h-4 w-12 mx-auto" />
                    </div>
                    <div>
                        <Skeleton className="h-5 w-16 mx-auto mb-1" />
                        <Skeleton className="h-4 w-12 mx-auto" />
                    </div>
                     <div>
                        <Skeleton className="h-5 w-16 mx-auto mb-1" />
                        <Skeleton className="h-4 w-12 mx-auto" />
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      {!isLoading && weather && (
        <Card className="w-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg dark:from-blue-800 dark:to-cyan-700">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{city}</CardTitle>
            <p className="text-lg opacity-90">{weather.condition}</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <WeatherIcon condition={weather.condition} className="w-24 h-24 mb-4 text-yellow-300 drop-shadow-lg" />
            <p className="text-7xl font-bold">{weather.temperature}°C</p>
            <div className="grid grid-cols-3 gap-4 text-center text-sm w-full pt-6">
              <div className="flex flex-col items-center gap-1">
                <Thermometer className="w-6 h-6 opacity-80" />
                <span className="font-semibold">{weather.temperature}°C</span>
                <span className="text-xs opacity-70">Temp</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Droplets className="w-6 h-6 opacity-80" />
                <span className="font-semibold">{weather.humidity}%</span>
                <span className="text-xs opacity-70">Humidity</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Wind className="w-6 h-6 opacity-80" />
                <span className="font-semibold">{weather.windSpeed} km/h</span>
                <span className="text-xs opacity-70">Wind</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
       {!isLoading && !weather && (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <Sun className="w-16 h-16 mb-4"/>
            <p className="font-headline text-xl">What's the weather like?</p>
            <p>Enter a city to find out.</p>
        </div>
      )}

    </div>
  );
}
