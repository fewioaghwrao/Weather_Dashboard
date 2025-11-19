// src/app/admin/error.tsx
"use client";

export default function AdminError({ error, reset }: any) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2 text-red-600">管理画面エラー</h1>
      <p className="text-slate-600 mb-4">
        管理画面でエラーが発生しました。
      </p>
      <button
        onClick={() => reset()}
        className="px-3 py-2 bg-red-600 text-white rounded"
      >
        再読み込み
      </button>
    </div>
  );
}
