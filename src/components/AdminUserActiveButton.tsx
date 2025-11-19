// src/components/AdminUserActiveButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  userId: number | bigint;   // ← bigint も許容
  isActive: boolean;
  isAdmin: boolean;
};

export default function AdminUserActiveButton({
  userId,
  isActive,
  isAdmin,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const label = isActive ? "有効" : "無効";
  const nextLabel = isActive ? "無効" : "有効";

  async function handleClick() {
    if (isAdmin) {
      alert("管理者アカウントの有効・無効は変更できません。");
      return;
    }

    if (loading) return;

    const ok = window.confirm(
      `このアカウントを「${nextLabel}」に変更しますか？`
    );
    if (!ok) return;

    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/users/${Number(userId)}/active`,  // ← ここで number 化
        {
          method: "PATCH",
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "アカウント状態の更新に失敗しました。");
        return;
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`px-2 py-1 rounded text-xs font-semibold border ${
        isActive
          ? "border-emerald-500 text-emerald-600 bg-emerald-50"
          : "border-slate-400 text-slate-600 bg-slate-50"
      } ${isAdmin ? "opacity-60 cursor-not-allowed" : "hover:opacity-80"}`}
    >
      {loading ? "更新中..." : label}
    </button>
  );
}
