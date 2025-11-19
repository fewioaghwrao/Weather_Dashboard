// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendPasswordResetMail } from "@/lib/mail";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "メールアドレスを入力してください。" },
      { status: 400 }
    );
  }

  // ユーザーを検索
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // ユーザーがいなくても「成功」と返す（存在有無を漏らさないため）
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  // トークン生成（UUIDでもOK）
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1時間

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetExpires: expires,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/auth/reset-password/${token}`;

  await sendPasswordResetMail(user.email, resetUrl);

  return NextResponse.json({ ok: true });
}
