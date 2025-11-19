// src/app/auth/forgot-password/page.tsx
"use client";

import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // 成否にかかわらず「送信しました」と表示してOK
      setDone(true);
    } catch (e) {
      console.error(e);
      setError("エラーが発生しました。時間をおいて再度お試しください。");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">パスワード再設定</h1>

        {done ? (
          <p className="text-sm text-slate-700">
            入力いただいたメールアドレス宛に、パスワード再設定用のURLを送信しました。
            メールをご確認ください。
          </p>
        ) : (
          <>
            <p className="text-sm text-slate-600">
              会員登録時に設定したメールアドレスを入力してください。
              パスワード再設定用URLをお送りします。
            </p>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700"
              >
                再設定用URLを送信
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
