// src/components/WeatherDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import WeatherCard from "./WeatherCard";
import type { WeatherResponse } from "@/types/weather";
import type { ForecastDay } from "@/lib/openWeather";
import { getWeatherColorByIcon } from "@/lib/weatherColor";
import jsPDF from "jspdf";  
import { setupJpFont } from "@/lib/jpPdfFont"; // ★ 追加

type CityItem = {
  id: number;
  name: string;
  nameJa: string;
  prefecture: string | null;
};

export default function WeatherDashboard() {
  const [keyword, setKeyword] = useState("");
  const [cities, setCities] = useState<CityItem[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityItem | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(false);

  
  const [favoriteCityIds, setFavoriteCityIds] = useState<number[]>([]);
  const [favLoading, setFavLoading] = useState(false);


  // 初期表示：id=1 (札幌) の天気＋お気に入り情報を読み込む
  useEffect(() => {
    (async () => {
      try {
        const cityId = 1;
        const [cityRes, favoritesRes, weatherRes, forecastRes] =
          await Promise.all([
            fetch(`/api/cities?keyword=`),
            fetch(`/api/favorites`),
            fetch(`/api/weather/current?cityId=${cityId}`),
            fetch(`/api/weather/forecast5?cityId=${cityId}`),
          ]);

        const citiesJson: CityItem[] = await cityRes.json();
        setCities(citiesJson);
        const defaultCity = citiesJson.find((c) => c.id === cityId) ?? null;
        setSelectedCity(defaultCity);

        const favoritesJson: { cityIds: number[] } = await favoritesRes.json();
        if (Array.isArray(favoritesJson.cityIds)) {
          setFavoriteCityIds(favoritesJson.cityIds);
        }

        const weatherJson: WeatherResponse = await weatherRes.json();
        setWeather(weatherJson);

        const forecastJson: { forecast: ForecastDay[] } =
          await forecastRes.json();
        setForecast(forecastJson.forecast);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  const handleToggleFavorite = async (city: CityItem | null) => {
    if (!city) return;

    const isFav = favoriteCityIds.includes(city.id);
    setFavLoading(true);

    try {
      if (isFav) {
        // 解除
        const res = await fetch(`/api/favorites/${city.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setFavoriteCityIds((prev) => prev.filter((id) => id !== city.id));
        }
      } else {
        // 登録
        const res = await fetch(`/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cityId: city.id }),
        });
        if (res.ok) {
          setFavoriteCityIds((prev) =>
            prev.includes(city.id) ? prev : [...prev, city.id]
          );
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFavLoading(false);
    }
  };
  // 都市検索
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/cities?keyword=${encodeURIComponent(keyword)}`);
    const data: CityItem[] = await res.json();
    setCities(data);
  };

  // 都市選択 → 天気取得
  const handleSelectCity = async (city: CityItem) => {
    setSelectedCity(city);
    setLoading(true);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`/api/weather/current?cityId=${city.id}`),
        fetch(`/api/weather/forecast5?cityId=${city.id}`),
      ]);

      const weatherJson: WeatherResponse = await weatherRes.json();
      setWeather(weatherJson);

      const forecastJson: { forecast: ForecastDay[] } =
        await forecastRes.json();
      setForecast(forecastJson.forecast);
    } finally {
      setLoading(false);
    }
  };

 const handleDownloadForecastPdf = () => {
  if (forecast.length === 0) {
    alert("5日間の天気データがありません。先に都市を選択してください。");
    return;
  }

  const doc = new jsPDF();

  // ★ 日本語フォントをセット
  setupJpFont(doc);

  const title = selectedCity
    ? `${selectedCity.prefecture ? selectedCity.prefecture + "・" : ""}${selectedCity.nameJa} の5日間の天気`
    : "5日間の天気";

  // タイトル
  doc.setFontSize(16);
  doc.text(title, 10, 15);

  // 出力日時（ここは日本語でもOK）
  const now = new Date().toLocaleString("ja-JP");
  doc.setFontSize(10);
  doc.text(`出力日時：${now}`, 10, 22);

  // テーブルヘッダ
  let y = 32;
  doc.setFontSize(12);
  doc.text("日付", 10, y);
  doc.text("天気", 60, y);
  doc.text("気温（最低／最高）", 120, y);

  doc.setFontSize(11);
  y += 8;

  // 5日分のデータを書き込む
  forecast.forEach((day) => {
    doc.text(day.date, 10, y);
    doc.text(day.condition, 60, y); // ← ここも日本語でOK
    doc.text(
      `${day.tempMin.toFixed(0)}℃ / ${day.tempMax.toFixed(0)}℃`,
      120,
      y
    );
    y += 7;

    // 改ページ対応
    if (y > 270) {
      doc.addPage();
      setupJpFont(doc); // ★ 新しいページでもフォントセットしておく
      y = 20;
    }
  });

  const fileName = selectedCity
    ? `5日間の天気_${selectedCity.nameJa}.pdf`
    : "5日間の天気.pdf";

  doc.save(fileName);
};


  const favoriteCities = cities.filter((c) =>
    favoriteCityIds.includes(c.id)
  );
  const otherCities = cities.filter((c) =>
    !favoriteCityIds.includes(c.id)
  );
 return (
    <div className="flex flex-col gap-6">
      {/* 検索フォーム */}
<form
  onSubmit={handleSearch}
  className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
>
  <input
    type="text"
    placeholder="都市名・都道府県名で検索（例：東京, 北海道）"
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
  />

  <div className="flex gap-2">
    <button
      type="submit"
      className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium shadow hover:bg-sky-700 transition-colors"
    >
      検索
    </button>

    {/* ★ 5日間PDF出力ボタン */}
    <button
      type="button"
      onClick={handleDownloadForecastPdf}
      disabled={forecast.length === 0}
      className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium bg-white hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      5日間の天気をPDF出力
    </button>
  </div>
</form>

      {/* 都市一覧 */}
      <div className="bg-white/80 rounded-xl border border-slate-200 shadow-sm p-3 max-h-64 overflow-y-auto">
        <h2 className="text-sm font-semibold mb-2 text-slate-700">
          都市一覧
        </h2>

        {/* お気に入り都市 */}
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-slate-500 mb-1">
            お気に入りの都市
          </h3>
          {favoriteCities.length === 0 ? (
            <p className="text-[11px] text-slate-400">
              まだお気に入りが登録されていません。
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {favoriteCities.map((city) => {
                const active = selectedCity?.id === city.id;
                return (
                  <li key={city.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        active
                          ? "bg-sky-600 text-white border-sky-600"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-sky-50"
                      }`}
                    >
                      {city.prefecture
                        ? `${city.prefecture}・${city.nameJa}`
                        : city.nameJa}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <hr className="my-2" />

        {/* お気に入り以外の都市 */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 mb-1">
            その他の都市
          </h3>
          {otherCities.length === 0 ? (
            <p className="text-[11px] text-slate-400">
              都市が見つかりませんでした。
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {otherCities.map((city) => {
                const active = selectedCity?.id === city.id;
                return (
                  <li key={city.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        active
                          ? "bg-sky-600 text-white border-sky-600"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-sky-50"
                      }`}
                    >
                      {city.prefecture
                        ? `${city.prefecture}・${city.nameJa}`
                        : city.nameJa}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* 現在の天気 */}
      {weather && (
        <div className="mt-2">
          <WeatherCard
            data={weather}
            isFavorite={
              selectedCity ? favoriteCityIds.includes(selectedCity.id) : false
            }
            onToggleFavorite={() => handleToggleFavorite(selectedCity)}
          />
          {favLoading && (
            <p className="mt-1 text-[11px] text-slate-500">
              お気に入りを更新しています…
            </p>
          )}
        </div>
      )}

      {/* 5日間予報 */}
      {forecast.length > 0 && (
  <section className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-4">
    <h2 className="text-sm font-semibold text-slate-700 mb-3">
      {selectedCity ? `${selectedCity.nameJa} の5日間の天気` : "5日間の天気"}
    </h2>

    {loading && (
      <p className="text-xs text-slate-500 mb-2">読み込み中...</p>
    )}

    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {forecast.map((day) => (
<div
  key={day.date}
  className={`flex flex-col items-center 
  rounded-xl p-2 text-xs 
  border ${getWeatherColorByIcon(day.icon)}`}
>
  <p className="font-medium mb-1">
    {day.date}
  </p>
  <img
    src={day.iconUrl}
    alt={day.condition}
    className="w-12 h-12 mb-1"
  />
  <p className="text-[11px] text-slate-600 mb-1">
    {day.condition}
  </p>
  <p className="font-semibold">
    {day.tempMin.toFixed(0)}℃ / {day.tempMax.toFixed(0)}℃
  </p>
</div>
      ))}
    </div>
  </section>
      )}
    </div>
  );
}
