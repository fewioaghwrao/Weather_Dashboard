// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret");
const alg = "HS256";

async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "メールアドレスとパスワードを入力してください。" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 1) ユーザーがそもそも存在しない
    if (!user) {
      return NextResponse.json(
        { error: "メールアドレスまたはパスワードが正しくありません。" },
        { status: 401 }
      );
    }

    // 2) アカウントが無効（メール未認証 or 退会など）
    if (!user.isActive) {
      return NextResponse.json(
        { error: "このアカウントは利用できません。メール認証が未完了か、退会済みの可能性があります。" },
        { status: 403 } // 状態としては 403 Forbidden にしても良い
      );
    }

    // 3) パスワードチェック
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "メールアドレスまたはパスワードが正しくありません。" },
        { status: 401 }
      );
    }

    // lastLoginAt 更新
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // ロールに応じて遷移先を決定
    const redirectTo =
      user.role === "ADMIN" ? "/admin/members" : "/member/dashboard";

    const token = await createToken({
      sub: user.id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    });

    const res = NextResponse.json({ redirectTo });

    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7日
    });

    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "ログイン処理でエラーが発生しました。" },
      { status: 500 }
    );
  }
}
