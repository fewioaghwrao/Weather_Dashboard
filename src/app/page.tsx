// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 text-center">
          Weather Dashboard
        </h1>
        <p className="text-sm text-slate-600 text-center">
          天気ダッシュボードへようこそ。
          <br />
          ログインして会員用ダッシュボードを利用できます。
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <Link
            href="/auth/login"
            className="w-full inline-flex items-center justify-center px-4 py-2 rounded bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700"
          >
            ログイン画面へ
          </Link>

          <Link
            href="/auth/register"
            className="w-full inline-flex items-center justify-center px-4 py-2 rounded border border-slate-300 text-sm text-slate-700 hover:bg-slate-50"
          >
            新規会員登録
          </Link>
        </div>
      </div>
    </main>
  );
}

