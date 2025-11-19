// src/app/admin/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "管理者メニュー | Weather Dashboard",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    // ここは html/body を書かない！
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-4">
        {/* 共通ヘッダーなど */}
        {children}
      </div>
    </div>
  );
}

