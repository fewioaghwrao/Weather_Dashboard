"use client";

export default function GlobalError({ error, reset }: any) {
  console.error(error);

  return (
    <html>
      <body className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">エラーが発生しました</h1>

        <p className="text-slate-600 mb-4">
          一時的な問題が発生しました。時間を置いて再度お試しください。
        </p>

        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
        >
          再読み込み
        </button>
      </body>
    </html>
  );
}
