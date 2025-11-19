// src/app/api/favorites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: BigInt(current.id) },
    select: { cityId: true },
  });

  return NextResponse.json({
    cityIds: favorites.map((f) => f.cityId),
  });
}

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    const { cityId } = await req.json();

    if (!cityId || Number.isNaN(Number(cityId))) {
      return NextResponse.json(
        { error: "cityId が不正です。" },
        { status: 400 }
      );
    }

    await prisma.favorite.upsert({
      where: {
        userId_cityId: {
          userId: BigInt(current.id),
          cityId: Number(cityId),
        },
      },
      create: {
        userId: BigInt(current.id),
        cityId: Number(cityId),
      },
      update: {},
    });

    return NextResponse.json({ message: "お気に入りに登録しました。" }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "お気に入り登録でエラーが発生しました。" },
      { status: 500 }
    );
  }
}
