import React, { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudSnow, Droplets, Sun, Wind, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type WeatherData = {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: React.ReactNode;
  forecast: {
    day: string;
    condition: string;
    minTemp: number;
    maxTemp: number;
    icon: React.ReactNode;
  }[];
};

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "clear":
      return <Sun className="text-yellow-500" />;
    case "clouds":
      return <Cloud className="text-gray-500" />;
    case "rain":
      return <CloudRain className="text-blue-500" />;
    case "snow":
      return <CloudSnow className="text-blue-200" />;
    default:
      return <Sun className="text-yellow-500" />;
  }
};

const fetchWeatherFromAPI = async (location: string): Promise<WeatherData> => {
  try {
    if (!OPENWEATHER_API_KEY) {
      throw new Error("Missing VITE_OPENWEATHER_API_KEY configuration.");
    }

    console.log("Fetching weather for location:", location);
    
    // Fetch current weather
    const currentWeatherUrl = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    console.log("Current weather URL:", currentWeatherUrl);
    
    const currentWeatherResponse = await fetch(currentWeatherUrl);
    if (!currentWeatherResponse.ok) {
      throw new Error(`Current weather API error: ${currentWeatherResponse.status} ${currentWeatherResponse.statusText}`);
    }
    const currentWeatherData = await currentWeatherResponse.json();
    console.log("Current weather data:", currentWeatherData);

    // Fetch 5-day forecast
    const forecastUrl = `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(location)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    console.log("Forecast URL:", forecastUrl);
    
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.status} ${forecastResponse.statusText}`);
    }
    const forecastData = await forecastResponse.json();
    console.log("Forecast data:", forecastData);

    // Process current weather
    const currentWeather = {
      temperature: Math.round(currentWeatherData.main.temp),
      condition: currentWeatherData.weather[0].main,
      humidity: currentWeatherData.main.humidity,
      windSpeed: Math.round(currentWeatherData.wind.speed),
      icon: getWeatherIcon(currentWeatherData.weather[0].main),
      forecast: [] as WeatherData["forecast"]
    };

    // Process forecast data
    const dailyForecasts = forecastData.list.filter((_item: any, index: number) => index % 8 === 0);
    currentWeather.forecast = dailyForecasts.slice(0, 5).map((day: any, index: number) => {
      const date = new Date(day.dt * 1000);
      const dayName = index === 0 ? "Today" : 
                     index === 1 ? "Tomorrow" : 
                     date.toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        day: dayName,
        condition: day.weather[0].main,
        minTemp: Math.round(day.main.temp_min),
        maxTemp: Math.round(day.main.temp_max),
        icon: getWeatherIcon(day.weather[0].main)
      };
    });

    return currentWeather;
  } catch (error) {
    console.error("Detailed error fetching weather data:", error);
    if (error instanceof Error) {
      throw new Error(`Weather API Error: ${error.message}`);
    }
    throw error;
  }
};

interface WeatherProps {
  location: string;
  className?: string;
}

const Weather = ({ location, className = "" }: WeatherProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherFromAPI(location);
      setWeatherData(data);
    } catch (err) {
      setError("Failed to fetch weather data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchWeatherData();
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  if (loading && !isRefreshing) {
    return (
      <div className={`${className}`}>
        <section role="status" aria-label="Loading weather forecast" className="glassmorphism rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
          <div className="my-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="mx-auto h-4 w-14" />
                <Skeleton className="mx-auto h-8 w-8 rounded-full" />
                <Skeleton className="mx-auto h-3 w-12" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-vander-gray">{error || "Weather data unavailable"}</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="glassmorphism rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-vander-dark">Weather Forecast</h2>
          <button 
            onClick={handleRefresh}
            className={`p-2 hover:bg-vander-teal/10 rounded-full transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
            title="Refresh weather data"
            disabled={isRefreshing}
          >
            <RefreshCw size={18} className="text-vander-teal" />
          </button>
        </div>
        
        {/* Current weather */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-vander-teal/10 rounded-full mr-3">
              {weatherData.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-vander-dark">{weatherData.temperature}°C</div>
              <div className="text-vander-gray">{weatherData.condition}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-vander-gray">
              <Droplets size={16} className="mr-1" />
              <span>Humidity: {weatherData.humidity}%</span>
            </div>
            <div className="flex items-center text-vander-gray">
              <Wind size={16} className="mr-1" />
              <span>Wind: {weatherData.windSpeed} km/h</span>
            </div>
          </div>
        </div>
        
        {/* 5-day forecast */}
        <div className="grid grid-cols-5 gap-2">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-medium text-vander-dark mb-1">{day.day}</div>
              <div className="mx-auto w-8 h-8 flex items-center justify-center mb-1">
                {day.icon}
              </div>
              <div className="text-xs">
                <span className="text-vander-gray">{day.minTemp}°</span>
                <span className="mx-1">-</span>
                <span className="font-medium text-vander-dark">{day.maxTemp}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
