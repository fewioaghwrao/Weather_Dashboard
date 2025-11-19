// src/lib/openWeather.ts
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

if (!OPENWEATHER_API_KEY) {
  throw new Error("OPENWEATHER_API_KEY is not set in environment variables");
}

type RawOpenWeatherResponse = {
  weather: { main: string; description: string; icon: string }[];
  main: { temp: number; humidity: number };
  wind?: { speed: number };
};

export type NormalizedWeather = {
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
};

export async function fetchCurrentWeatherFromOpenWeather(lat: number, lon: number): Promise<NormalizedWeather> {
  const url = `${OPENWEATHER_BASE_URL}?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${OPENWEATHER_API_KEY}`;

  const res = await fetch(url, {
    // Next.js のルートハンドラ用キャッシュ設定（必要に応じて）
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenWeather API error: ${res.status} ${res.statusText} ${text}`);
  }

  const data = (await res.json()) as RawOpenWeatherResponse;

  const primaryWeather = data.weather?.[0];

  return {
    temp: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind?.speed ?? 0,
    condition: primaryWeather?.main ?? "Unknown",
    icon: primaryWeather?.icon ?? "",
  };
}

// ====================================
// 5日間天気予報 API （追記）
// ====================================

const OPENWEATHER_FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

type RawForecastResponse = {
  list: Array<{
    dt: number;
    dt_txt: string; // "2025-11-15 12:00:00"
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
};

export type ForecastDay = {
  date: string;      // "2025-11-15"
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  iconUrl: string;
};

/**
 * 5日間の予報（3時間刻み）を日単位に集約して返す
 */
export async function fetch5DayForecastFromOpenWeather(
  lat: number,
  lon: number
): Promise<ForecastDay[]> {
  const url = `${OPENWEATHER_FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${OPENWEATHER_API_KEY}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`OpenWeather 5-day forecast error: ${res.status}`);
  }

  const json = (await res.json()) as RawForecastResponse;

  // 日付ごとにまとめる
  const byDate = new Map<
    string,
    { min: number; max: number; item: RawForecastResponse["list"][number] }
  >();

  for (const item of json.list) {
    const date = item.dt_txt.split(" ")[0]; // "YYYY-MM-DD"

    const min = item.main.temp_min;
    const max = item.main.temp_max;

    if (!byDate.has(date)) {
      byDate.set(date, { min, max, item });
    } else {
      const current = byDate.get(date)!;
      current.min = Math.min(current.min, min);
      current.max = Math.max(current.max, max);
    }
  }

  // 最初の5日間だけ返す
  const result: ForecastDay[] = Array.from(byDate.entries())
    .slice(0, 5)
    .map(([date, { min, max, item }]) => {
      const w = item.weather[0];
      return {
        date,
        tempMin: min,
        tempMax: max,
        condition: w.description,
        icon: w.icon,
        iconUrl: `https://openweathermap.org/img/wn/${w.icon}@2x.png`,
      };
    });

  return result;
}
