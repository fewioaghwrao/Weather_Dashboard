// src/app/api/weather/forecast5/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetch5DayForecastFromOpenWeather } from "@/lib/openWeather";

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
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    // lat/lon は既に NOT NULL になっている前提
    const forecast = await fetch5DayForecastFromOpenWeather(city.lat, city.lon);

    return NextResponse.json({
      city: {
        id: city.id,
        name: city.nameEn ?? city.nameJa,
      },
      forecast,
    });
  } catch (err) {
    console.error("GET /api/weather/forecast5 error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
