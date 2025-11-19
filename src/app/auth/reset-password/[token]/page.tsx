// src/app/auth/reset-password/[token]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const token = params.token;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("パスワードが一致しません。");
      return;
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください。");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "パスワードの再設定に失敗しました。");
        return;
      }

      setDone(true);
      // 数秒後にログイン画面に飛ばす、などもあり
      // setTimeout(() => router.push("/auth/login"), 3000);
    } catch (e) {
      console.error(e);
      setError("エラーが発生しました。時間をおいて再度お試しください。");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">新しいパスワード設定</h1>

        {done ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-700">
              パスワードの再設定が完了しました。
            </p>
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full py-2 rounded bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700"
            >
              ログイン画面へ
            </button>
          </div>
        ) : (
          <>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  新しいパスワード
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="w-full border rounded px-3 py-2 pr-10 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-sm"
                    aria-label={passwordVisible ? "パスワードを隠す" : "パスワードを表示"}
                  >
                    {passwordVisible ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

               <div>
                <label className="block text-sm font-medium mb-1">
                  新しいパスワード（確認）
                </label>
                <div className="relative">
                  <input
                    type={confirmVisible ? "text" : "password"}
                    className="w-full border rounded px-3 py-2 pr-10 text-sm"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setConfirmVisible((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-sm"
                    aria-label={confirmVisible ? "パスワードを隠す" : "パスワードを表示"}
                  >
                    {confirmVisible ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700"
              >
                パスワードを更新
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
