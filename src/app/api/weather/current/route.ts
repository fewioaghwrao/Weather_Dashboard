// src/app/api/weather/current/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchCurrentWeatherFromOpenWeather } from "@/lib/openWeather";
import { translateConditionToJa } from "@/lib/weatherConditionJa";

const CACHE_TTL_MINUTES = 10; // キャッシュ有効時間

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cityIdParam = searchParams.get("cityId");

    if (!cityIdParam) {
      return NextResponse.json(
        { error: "cityId query parameter is required" },
        { status: 400 }
      );
    }

    const cityId = Number(cityIdParam);
    if (Number.isNaN(cityId)) {
      return NextResponse.json(
        { error: "cityId must be a number" },
        { status: 400 }
      );
    }

    const city = await prisma.city.findUnique({
      where: { id: cityId },
    });

    if (!city) {
      return NextResponse.json(
        { error: "City not found" },
        { status: 404 }
      );
    }

    const now = new Date();

    // ★ 日本語情報も含めた city ペイロードを共通化
    const cityPayload = {
      id: city.id,
      name: city.nameEn ?? city.nameJa, // 内部用（英語 or 日本語）
      nameJa: city.nameJa,              // 日本語名
      prefecture: city.prefecture,      // 都道府県
      lat: city.lat,
      lon: city.lon,
    };

    // 2. キャッシュ確認
    const cache = await prisma.weatherCache.findUnique({
      where: { cityId: city.id },
    });

    if (cache) {
      const diffMs = now.getTime() - cache.fetchedAt.getTime();
      const diffMinutes = diffMs / 1000 / 60;

      if (diffMinutes < CACHE_TTL_MINUTES) {
        // キャッシュ有効 → それを返す
        return NextResponse.json({
          source: "cache",
          city: cityPayload, // ← ここ
          weather: {
            temp: cache.temp,
            humidity: cache.humidity,
            windSpeed: cache.windSpeed,
            condition: translateConditionToJa(cache.condition),   // ★ 日本語
            icon: cache.icon,
            iconUrl: `https://openweathermap.org/img/wn/${cache.icon}@2x.png`,
          },
          fetchedAt: cache.fetchedAt,
        });
      }
    }

    // 3. キャッシュ切れ or キャッシュ無し → OpenWeather から取得
    const newWeather = await fetchCurrentWeatherFromOpenWeather(
      city.lat,
      city.lon
    );

    // 4. キャッシュ upsert
    const saved = await prisma.weatherCache.upsert({
      where: { cityId: city.id },
      create: {
        cityId: city.id,
        temp: newWeather.temp,
        humidity: newWeather.humidity,
        windSpeed: newWeather.windSpeed,
        condition: newWeather.condition,
        icon: newWeather.icon,
        fetchedAt: now,
      },
      update: {
        temp: newWeather.temp,
        humidity: newWeather.humidity,
        windSpeed: newWeather.windSpeed,
        condition: newWeather.condition,
        icon: newWeather.icon,
        fetchedAt: now,
      },
    });

    // 5. 正常レスポンス
    return NextResponse.json({
      source: cache ? "api(refresh)" : "api",
      city: cityPayload, // ← ここも
      weather: {
        temp: saved.temp,
        humidity: saved.humidity,
        windSpeed: saved.windSpeed,
        condition: translateConditionToJa(saved.condition), 
        icon: saved.icon,
        iconUrl: `https://openweathermap.org/img/wn/${saved.icon}@2x.png`,
      },
      fetchedAt: saved.fetchedAt,
    });
  } catch (err: unknown) {
    console.error("GET /api/weather/current error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

