
import React, { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudSnow, Droplets, Sun, Wind } from "lucide-react";

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

// Mock weather data generator function
const getMockWeatherData = (location: string): WeatherData => {
  const conditions = ["Sunny", "Cloudy", "Rainy", "Snowy", "Partly Cloudy"];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  const getIcon = (condition: string) => {
    switch (condition) {
      case "Sunny": return <Sun className="text-yellow-500" />;
      case "Cloudy": return <Cloud className="text-gray-500" />;
      case "Rainy": return <CloudRain className="text-blue-500" />;
      case "Snowy": return <CloudSnow className="text-blue-200" />;
      case "Partly Cloudy": return <Cloud className="text-gray-400" />;
      default: return <Sun className="text-yellow-500" />;
    }
  };
  
  const generateForecast = () => {
    const days = ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5"];
    return days.map(day => {
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const minTemp = Math.floor(Math.random() * 15) + 10;
      const maxTemp = minTemp + Math.floor(Math.random() * 10) + 5;
      return {
        day,
        condition,
        minTemp,
        maxTemp,
        icon: getIcon(condition)
      };
    });
  };
  
  return {
    temperature: Math.floor(Math.random() * 30) + 5,
    condition: randomCondition,
    humidity: Math.floor(Math.random() * 60) + 30,
    windSpeed: Math.floor(Math.random() * 30),
    icon: getIcon(randomCondition),
    forecast: generateForecast()
  };
};

interface WeatherProps {
  location: string;
  className?: string;
}

const Weather = ({ location, className = "" }: WeatherProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a delay
    setLoading(true);
    setTimeout(() => {
      const data = getMockWeatherData(location);
      setWeatherData(data);
      setLoading(false);
    }, 800);
  }, [location]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-6 ${className}`}>
        <div className="w-8 h-8 border-4 border-vander-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-vander-gray">Weather data unavailable</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="glassmorphism rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-vander-dark mb-4">Weather Forecast</h2>
        
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
