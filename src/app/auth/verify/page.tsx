// src/app/auth/verify/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type VerifyPageProps = {
  // ★ Next.js 16 / Turbopack では Promise になっている前提
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  // ★ 必ず await する
  const sp = await searchParams;

  const raw = sp?.token;
  const token = Array.isArray(raw) ? raw[0] : raw || "";

  console.log("[VERIFY] searchParams =", sp);
  console.log("[VERIFY] token =", token);

  let title = "メールアドレス認証";
  let message = "";
  let isSuccess = false;

  if (!token) {
    message = "トークンが指定されていません。URLを確認してください。";
  } else {
    const record = await prisma.emailVerificationToken.findUnique({
      where: { token },
    });

    if (!record) {
      message =
        "無効なトークンです。すでに利用済み、またはURLが誤っている可能性があります。";
    } else if (record.usedAt) {
      message = "このメールアドレスはすでに認証済みです。ログインしてください。";
      isSuccess = true;
    } else if (record.expiresAt < new Date()) {
      message =
        "トークンの有効期限が切れています。お手数ですが、再度会員登録をやり直してください。";
    } else {
      // 有効なトークン → ユーザーを有効化 & トークンを使用済みにする
      await prisma.$transaction([
        prisma.user.update({
          where: { id: record.userId },
          data: {
            isActive: true, // ★ ここで isActive を true に
          },
        }),
        prisma.emailVerificationToken.update({
          where: { id: record.id },
          data: { usedAt: new Date() },
        }),
      ]);

      message = "メールアドレスの認証が完了しました。ログインしてください。";
      isSuccess = true;
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">{title}</h1>

        <p
          className={`text-sm ${
            isSuccess ? "text-green-700" : "text-red-700"
          } bg-slate-50 border rounded px-3 py-2`}
        >
          {message}
        </p>

        <div className="text-center mt-4">
          <Link
            href="/auth/login"
            className="inline-block px-4 py-2 text-sm font-semibold rounded bg-sky-600 text-white hover:bg-sky-700"
          >
            ログイン画面へ
          </Link>
        </div>
      </div>
    </main>
  );
}
