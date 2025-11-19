// src/app/api/member/withdraw/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    // isActive を false にする（アカウント停止）
    await prisma.user.update({
      where: { id: BigInt(current.id) },
      data: {
        isActive: false,
      },
    });

    // セッションCookie削除
    const res = NextResponse.json({
      message: "退会処理が完了しました。",
    });

    res.cookies.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "退会処理でエラーが発生しました。" },
      { status: 500 }
    );
  }
}
