'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Cloud, CloudRain, Wind, Droplets, AlertCircle, MapPin } from 'lucide-react';

interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    description: string;
    location: string;
  };
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    rainfall: number;
    description: string;
  }>;
  insights: string[];
}

export default function WeatherPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        () => {
          // If geolocation fails, show default location
          setWeatherData(mockWeatherData('Bangalore'));
        }
      );
    }
  }, [params]);

  const t = getTranslation(locale);

  // Mock weather data for demonstration
  const mockWeatherData = (locationName: string): WeatherData => {
    return {
      current: {
        temp: 28,
        humidity: 65,
        windSpeed: 12,
        description: 'Partly Cloudy',
        location: locationName,
      },
      forecast: [
        { date: 'Tomorrow', maxTemp: 30, minTemp: 22, rainfall: 5, description: 'Sunny' },
        { date: 'Day 2', maxTemp: 29, minTemp: 21, rainfall: 0, description: 'Clear' },
        { date: 'Day 3', maxTemp: 27, minTemp: 20, rainfall: 15, description: 'Rainy' },
        { date: 'Day 4', maxTemp: 26, minTemp: 19, rainfall: 20, description: 'Rainy' },
        { date: 'Day 5', maxTemp: 28, minTemp: 21, rainfall: 10, description: 'Cloudy' },
        { date: 'Day 6', maxTemp: 30, minTemp: 22, rainfall: 0, description: 'Sunny' },
        { date: 'Day 7', maxTemp: 31, minTemp: 23, rainfall: 2, description: 'Mostly Sunny' },
      ],
      insights: [
        'Optimal irrigation conditions next 2 days',
        'High rainfall expected day 3-4, avoid pesticide spraying',
        'Temperature is favorable for most crops',
        'Low wind speeds - good for operations',
        'Humidity is moderate - fungal disease risk is low',
      ],
    };
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError('');
      // Mock API call - replace with actual OpenWeatherMap API when credentials available
      setWeatherData(mockWeatherData('Your Location'));
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (location.trim()) {
      // Mock search - replace with actual API call
      setWeatherData(mockWeatherData(location));
      setLocation('');
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground">{t.weather.title}</h1>
          <p className="mt-2 text-muted-foreground">{t.weather.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="mb-8 flex gap-2">
          <Input
            placeholder={t.weather.location}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch}>{t.common.save}</Button>
        </div>

        {error && (
          <Card className="mb-8 border-destructive/50 bg-destructive/10 p-4 text-destructive flex gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </Card>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {weatherData && !loading && (
          <div className="space-y-8">
            {/* Current Weather */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5" />
                      <h2 className="text-2xl font-bold">{weatherData.current.location}</h2>
                    </div>
                    <p className="text-lg opacity-90">{weatherData.current.description}</p>
                  </div>
                  <Cloud className="h-16 w-16 opacity-80" />
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-6 sm:grid-cols-4">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">{t.weather.temperature}</p>
                    <p className="text-3xl font-bold text-foreground">{weatherData.current.temp}°C</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <Droplets className="h-4 w-4" />
                      {t.weather.humidity}
                    </p>
                    <p className="text-3xl font-bold text-foreground">{weatherData.current.humidity}%</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <Wind className="h-4 w-4" />
                      {t.weather.windSpeed}
                    </p>
                    <p className="text-3xl font-bold text-foreground">{weatherData.current.windSpeed} km/h</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <CloudRain className="h-4 w-4" />
                      {t.weather.rainfall}
                    </p>
                    <p className="text-3xl font-bold text-foreground">2 mm</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 7-Day Forecast */}
            <div>
              <h3 className="mb-4 text-xl font-semibold text-foreground">{t.weather.forecast}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
                {weatherData.forecast.map((day, index) => (
                  <Card key={index} className="p-4 text-center hover:shadow-lg transition-shadow">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">{day.date}</p>
                    <Cloud className="mx-auto h-8 w-8 text-primary mb-2" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">{day.maxTemp}° / {day.minTemp}°C</p>
                      <p className="text-xs text-muted-foreground">{day.description}</p>
                      <p className="text-xs text-blue-500">💧 {day.rainfall}mm</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Agricultural Insights */}
            <Card className="bg-primary/5 border-primary/20 p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                {t.weather.insights}
              </h3>
              <ul className="space-y-2">
                {weatherData.insights.map((insight, index) => (
                  <li key={index} className="flex gap-3 text-sm text-foreground">
                    <span className="text-primary font-bold">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Farming Recommendations */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Farming Recommendations</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <p className="font-semibold text-sm text-primary mb-2">✓ Recommended Activities</p>
                  <ul className="space-y-1 text-sm text-foreground">
                    <li>• Irrigation scheduling</li>
                    <li>• Soil preparation</li>
                    <li>• Pest monitoring</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                  <p className="font-semibold text-sm text-destructive mb-2">✗ Avoid Activities</p>
                  <ul className="space-y-1 text-sm text-foreground">
                    <li>• Pesticide spraying (rain expected)</li>
                    <li>• Harvesting during rainfall</li>
                    <li>• Heavy machinery use</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
