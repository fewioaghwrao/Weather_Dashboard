// src/components/MemberProfileForm.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  initialUser: {
    id: string;
    name: string;
    email: string;
    postalCode: string;
    address: string;
    phone: string;
  };
};

export default function MemberProfileForm({ initialUser }: Props) {
  const router = useRouter();

  const [name, setName] = useState(initialUser.name);
  const [email] = useState(initialUser.email); // 今回は表示のみ（編集不可）
  const [postalCode, setPostalCode] = useState(initialUser.postalCode);
  const [address, setAddress] = useState(initialUser.address);
  const [phone, setPhone] = useState(initialUser.phone);

  const [saving, setSaving] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");
    setSaving(true);

    try {
      const res = await fetch("/api/member/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          postalCode,
          address,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "会員情報の更新に失敗しました。");
        return;
      }

      setMessage("会員情報を更新しました。");
      // ダッシュボードに戻す場合はこれでもOK:
      // router.push("/member/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMsg("通信エラーが発生しました。");
    } finally {
      setSaving(false);
    }
  }

  async function handleWithdraw() {
    setErrorMsg("");
    setMessage("");

    // ★ 退会ポップアップ
    const ok = window.confirm(
      "本当に退会しますか？\n退会するとアカウントは利用できなくなります。"
    );
    if (!ok) return;

    setWithdrawing(true);
    try {
      const res = await fetch("/api/member/withdraw", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "退会処理に失敗しました。");
        return;
      }

      // セッションCookie削除済みを想定。トップorログイン画面へ。
      alert("退会が完了しました。ご利用ありがとうございました。");
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      setErrorMsg("通信エラーが発生しました。");
    } finally {
      setWithdrawing(false);
    }
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
          {errorMsg}
        </p>
      )}
      {message && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded px-3 py-2">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">氏名</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full border rounded px-3 py-2 text-sm bg-slate-100 text-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            メールアドレスの変更は不可です。
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">郵便番号</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="例：123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">住所</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">電話番号</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
  <button
    type="submit"
    disabled={saving}
    className="flex-1 py-2 rounded bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
  >
    {saving ? "保存中..." : "会員情報を保存"}
  </button>

  {/* ▼▼ 追加：戻るボタン ▼▼ */}
  <button
    type="button"
    onClick={() => router.push("/member/dashboard")}
    className="flex-1 py-2 rounded border border-slate-400 text-slate-600 text-sm font-semibold hover:bg-slate-50"
  >
    戻る
  </button>
  {/* ▲▲ 追加 ▲▲ */}

  <button
    type="button"
    disabled={withdrawing}
    onClick={handleWithdraw}
    className="flex-1 py-2 rounded border border-red-500 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-60"
  >
    {withdrawing ? "退会処理中..." : "退会する"}
  </button>
</div>

      </form>
    </div>
  );
}
