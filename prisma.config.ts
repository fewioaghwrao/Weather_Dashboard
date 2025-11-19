// prisma.config.ts
import "dotenv/config";  // ← これが .env を読み込む
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),   // ← .env の値を参照
  },
});

