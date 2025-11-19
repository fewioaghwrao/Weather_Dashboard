// src/app/member/dashboard/page.tsx
import { headers } from "next/headers";
import type { WeatherResponse } from "@/types/weather";
import WeatherDashboard from "@/components/WeatherDashboard";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";


export default async function DashboardPage() {
  const user = await getCurrentUser();  // ★ 追加
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol =
   process.env.NODE_ENV === "production" ? "https" : "http";

  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(
    `${baseUrl}/api/weather/current?cityId=1`,
    { cache: "no-store" }
  );
  const data: WeatherResponse = await res.json();

  return (
    <main className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">天気ダッシュボード</h1>
          {user && (
            <p className="text-sm text-slate-600 mt-1">
              {user.name} さん、こんにちは。
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* ★ 会員情報ボタン */}
          <Link
            href="/member/profile"
            className="px-3 py-2 text-xs md:text-sm rounded border border-sky-600 text-sky-600 hover:bg-sky-50"
          >
            会員情報
          </Link>

          <LogoutButton />
        </div>
      </div>

      {/* お好みで現在地の天気をカード表示するなら data を渡す */}
      {/* <WeatherCard weather={data} /> 等 */}

      <WeatherDashboard />
    </main>
  );
}
