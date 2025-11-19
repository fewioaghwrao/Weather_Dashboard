// src/lib/weatherConditionJa.ts
export function translateConditionToJa(condition: string): string {
  const map: Record<string, string> = {
    Clear: "快晴",
    Clouds: "曇り",
    Rain: "雨",
    Drizzle: "霧雨",
    Thunderstorm: "雷雨",
    Snow: "雪",
    Mist: "もや",
    Smoke: "煙",
    Haze: "靄",
    Dust: "砂塵",
    Fog: "霧",
    Sand: "砂",
    Ash: "火山灰",
    Squall: "スコール",
    Tornado: "竜巻",
  };

  return map[condition] ?? condition; // 無い場合はそのまま英語
}
