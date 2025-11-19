// src/app/loading.tsx
import Image from "next/image";

export default function RootLoading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-sky-100">
      <div className="flex flex-col items-center gap-4">
        {/* ロゴ（テキスト） */}
        <div className="text-2xl font-bold text-sky-700">
          Weather Dashboard
        </div>

        {/* 🔹 ローディング画像 */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <Image
            src="/images/loading.png"  // ← public/images/loading.png のパス
            alt="Loading"
            width={417}                // だいたいの元画像サイズでOK
            height={187}
            className="w-72 h-auto"    // Tailwindで表示サイズ調整
            priority
          />
        </div>

        <p className="text-sm text-slate-600">
          読み込み中です。しばらくお待ちください…
        </p>
      </div>
    </main>
  );
}

