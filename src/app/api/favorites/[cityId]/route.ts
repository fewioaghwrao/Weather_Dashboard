// src/app/api/favorites/[cityId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type Params = { cityId: string };

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ cityId: string }> } // ★ Promise 前提で受け取る
  
) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    const { cityId } = await ctx.params;

    const cityIdNum = Number(cityId);
    if (!cityIdNum || Number.isNaN(cityIdNum)) {
      return NextResponse.json(
        { error: "cityId が不正です。" },
        { status: 400 }
      );
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: BigInt(current.id),
        cityId: cityIdNum,
      },
    });

    return NextResponse.json({ message: "お気に入りを解除しました。" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "お気に入り解除でエラーが発生しました。" },
      { status: 500 }
    );
  }
}
