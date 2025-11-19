export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold mb-4">ページが見つかりません</h1>
      <p className="text-slate-600 mb-6">
        お探しのページは削除されたか、URLが間違っている可能性があります。
      </p>

      <a
        href="/auth/login"
        className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
      >
        ホームへ戻る
      </a>
    </main>
  );
}
