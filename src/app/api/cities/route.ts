// app/api/cities/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword")?.trim() ?? "";

  let where = {};

  if (keyword !== "") {
    where = {
      OR: [
        { nameJa: { contains: keyword } },
        { nameEn: { contains: keyword } },
        { prefecture: { contains: keyword } },
      ],
    };
  }

  const cities = await prisma.city.findMany({
    where,
    orderBy: { id: "asc" },
    take: 100,
  });

  return NextResponse.json(cities);
}
