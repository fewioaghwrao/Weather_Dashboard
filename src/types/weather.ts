// src/types/weather.ts の例
export type WeatherResponse = {
  city: {
    id: number;
    name: string;
    nameJa?: string;
    prefecture?: string | null;
    lat: number;
    lon: number;
  };
  weather: {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
    iconUrl?: string;
  };
  fetchedAt: string;
  source: "cache" | "api" | "api(refresh)";
};
