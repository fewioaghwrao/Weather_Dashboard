// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import { sendVerifyMail} from "@/lib/mail";

const EMAIL_VERIFY_TOKEN_EXPIRES_HOURS = 24;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      postalCode,
      address,
      phone,
      password,
    }: {
      name: string;
      email: string;
      postalCode?: string;
      address?: string;
      phone?: string;
      password: string;
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "氏名・メールアドレス・パスワードは必須です。" },
        { status: 400 }
      );
    }

    // すでに登録済みかチェック
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています。" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // 仮登録（isActive = false）
    const user = await prisma.user.create({
      data: {
        name,
        email,
        postalCode: postalCode || null,
        address: address || null,
        phone: phone || null,
        passwordHash,
        role: "MEMBER",
        isActive: false,
      },
    });

    // 認証用トークン作成
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(
      Date.now() + EMAIL_VERIFY_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000
    );

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const verifyUrl = `${baseUrl}/auth/verify?token=${token}`;

    // Mailtrap 経由で認証メールを送信
    const subject = "【お天気ダッシュボード】メールアドレス認証のお願い";
    const text = `
${name} 様

この度は会員登録ありがとうございます。
以下のURLをクリックして、メールアドレスの認証を完了してください。

${verifyUrl}

※本メールに心当たりがない場合は破棄してください。
※本リンクの有効期限は ${EMAIL_VERIFY_TOKEN_EXPIRES_HOURS} 時間です。`;

    const html = `
<p>${name} 様</p>
<p>この度は会員登録ありがとうございます。</p>
<p>以下のボタンをクリックして、メールアドレスの認証を完了してください。</p>
<p>
  <a href="${verifyUrl}" style="display:inline-block;padding:10px 18px;background:#0ea5e9;color:#fff;text-decoration:none;border-radius:4px;">
    メールアドレスを認証する
  </a>
</p>
<p>もしボタンが動作しない場合は、次のURLをブラウザにコピー＆ペーストしてください。</p>
<p><a href="${verifyUrl}">${verifyUrl}</a></p>
<p>※本リンクの有効期限は ${EMAIL_VERIFY_TOKEN_EXPIRES_HOURS} 時間です。</p>
`;

    await sendVerifyMail(email, name, verifyUrl);
   
    return NextResponse.json(
      {
        message:
          "仮登録が完了しました。確認メールを送信しましたので、メール内のURLから本登録を完了してください。",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}

