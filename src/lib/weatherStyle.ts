// src/lib/weatherStyle.ts

export function getForecastBg(condition: string) {
  const key = condition.toLowerCase();

  if (key.includes("clear")) {
    return "from-yellow-100 to-orange-200";
  }

  if (key.includes("cloud")) {
    // 曇りがち → グレー系
    return "from-slate-200 to-slate-300";
  }

  if (key.includes("rain")) {
    return "from-blue-200 to-blue-400";
  }

  if (key.includes("snow")) {
    return "from-cyan-100 to-white";
  }

  if (key.includes("fog") || key.includes("mist") || key.includes("haze")) {
    // 霧：背景薄めグレー＋アイコン白が見えるように緑系統
    return "from-emerald-100 to-emerald-200";
  }

  if (key.includes("thunder") || key.includes("storm")) {
    return "from-purple-200 to-purple-400";
  }

  // デフォルト
  return "from-gray-200 to-gray-300";
}
