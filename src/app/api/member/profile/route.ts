// src/app/api/member/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: BigInt(current.id) }, // sub を文字列として持っている前提
    select: {
      id: true,
      name: true,
      email: true,
      postalCode: true,
      address: true,
      phone: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "ユーザーが見つかりません。" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    const { name, postalCode, address, phone } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "氏名は必須です。" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: BigInt(current.id) },
      data: {
        name,
        postalCode: postalCode || null,
        address: address || null,
        phone: phone || null,
      },
    });

    return NextResponse.json({ message: "会員情報を更新しました。" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "会員情報の更新でエラーが発生しました。" },
      { status: 500 }
    );
  }
}
