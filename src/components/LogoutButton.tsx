// src/components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    } finally {
      startTransition(() => {
        router.push("/auth/login");
      });
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="px-3 py-1.5 text-sm rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-60"
    >
      {isPending ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}
