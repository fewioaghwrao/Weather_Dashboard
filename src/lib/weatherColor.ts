// src/lib/weatherColor.ts

// icon: "01d", "02n", "10d" など
export function getWeatherColorByIcon(icon: string) {
  if (!icon) {
    return "bg-slate-200 border-slate-300";
  }

  // 先頭 2 桁だけ見る（昼夜 d/n は無視）
  const code = icon.slice(0, 2); // "01", "02", "10", "13", "50" など

  switch (code) {
    case "01": // 晴れ
      return "bg-yellow-200 border-yellow-300";

    case "02": // 少し曇り
    case "03": // 曇りがち
    case "04": // 厚い雲
      // ▶ 曇りがち → グレー系
      return "bg-gray-300 border-gray-400";

    case "09": // にわか雨
    case "10": // 雨
      return "bg-blue-200 border-blue-300";

    case "11": // 雷
      return "bg-purple-200 border-purple-300";

    case "13": // 雪
      return "bg-sky-200 border-sky-300";

    case "50": // 霧・もや
      // ▶ グレー薄め + 緑系（白い雲アイコンが映える）
      return "bg-gray-200 border-emerald-300";

    default:
      return "bg-slate-200 border-slate-300";
  }
}

