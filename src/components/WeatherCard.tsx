"use client";

import Image from "next/image";
import { getWeatherIconUrl } from "@/lib/weatherIcon";
import type { WeatherResponse } from "@/types/weather";

type Props = {
  data: WeatherResponse;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export default function WeatherCard({ data, isFavorite, onToggleFavorite }: Props) {
  if (!data) return null;

  const { city, weather, fetchedAt } = data;
const cityLabelJa = city.nameJa ?? city.name;          // nameJa がなければ name
const prefectureLabel = city.prefecture ?? "";
  const fetchedLocal = new Date(fetchedAt).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isCache =
    data.source === "cache" || data.source === "api(refresh)";

  return (
    <section
      className="w-full max-w-xl rounded-2xl bg-gradient-to-br from-sky-500/80 via-sky-600 to-slate-900 text-white shadow-xl border border-white/10 p-5 md:p-6 flex flex-col gap-4 backdrop-blur"
    >
      {/* header */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-sky-100/80">
            現在の天気
          </p>
      { /*   <h2 className="text-2xl md:text-3xl font-semibold mt-1">
            {city.name}
          </h2>*/}
<h2 className="text-2xl md:text-3xl font-semibold mt-1">
  {prefectureLabel ? `${prefectureLabel}・${cityLabelJa}` : cityLabelJa}
</h2>
        {/*    <p className="text-xs md:text-sm text-sky-100/80 mt-1">
            緯度 {city.lat.toFixed(2)} ／ 経度 {city.lon.toFixed(2)}
          </p>*/}
        </div>


        <div className="flex flex-col items-end gap-2">
          {/* ソースバッジ */}
          <span
            className={
              "inline-flex items-center gap-1 text-[10px] md:text-xs px-2 py-1 rounded-full border " +
              (isCache
                ? "border-amber-300/60 bg-amber-400/15 text-amber-50"
                : "border-emerald-300/60 bg-emerald-400/15 text-emerald-50")
            }
          >
            <span
              className={
                "w-1.5 h-1.5 rounded-full " +
                (isCache ? "bg-amber-300" : "bg-emerald-300")
              }
            />
            {data.source === "cache"
              ? "キャッシュから取得"
              : data.source === "api(refresh)"
              ? "API再取得（キャッシュ更新）"
              : "APIから取得"}
          </span>

          {/* ★ お気に入りボタン */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              className="inline-flex items-center gap-1 text-[11px] md:text-xs px-2 py-1 rounded-full border border-yellow-300/60 bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors"
            >
              <span>{isFavorite ? "★" : "☆"}</span>
              <span>{isFavorite ? "お気に入り解除" : "お気に入り登録"}</span>
            </button>
          )}
        </div>

      </header>

      {/* main content */}
      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-4">
        {/* 左：アイコン＋気温 */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-white/15 blur-sm" />
            <Image
              src={getWeatherIconUrl(weather.icon)}
              alt={weather.condition}
              fill
              className="object-contain relative"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-semibold">
                {weather.temp.toFixed(1)}
              </span>
              <span className="text-lg text-sky-100/80">℃</span>
            </div>
            <p className="text-sm md:text-base text-sky-50 mt-1">
              {weather.condition}
            </p>
          </div>
        </div>

        {/* 右：詳細情報 */}
        <div className="flex-1 grid grid-cols-3 gap-2 w-full bg-slate-900/30 rounded-xl p-3 md:p-4 text-[11px] md:text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-sky-100/70">体感気温</span>
            <span className="text-sm md:text-base font-semibold">
              {weather.temp.toFixed(1)} ℃
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sky-100/70">湿度</span>
            <span className="text-sm md:text-base font-semibold">
              {weather.humidity} %
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sky-100/70">風速</span>
            <span className="text-sm md:text-base font-semibold">
              {weather.windSpeed.toFixed(1)} m/s
            </span>
          </div>

          {/* 下段 */}
          <div className="col-span-3 mt-1 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] md:text-xs text-sky-100/70">
              最終更新：{fetchedLocal}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
