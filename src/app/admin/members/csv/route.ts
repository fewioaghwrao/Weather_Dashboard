// src/app/admin/members/csv/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const normalize = (v: string | null): string => (v ?? "").trim();

  const idStr = normalize(searchParams.get("id"));
  const nameStr = normalize(searchParams.get("name"));
  const emailStr = normalize(searchParams.get("email"));
  const sortStr = normalize(searchParams.get("sort") ?? "createdAt_desc");

  // 🔹 一般会員のみ
  const where: any = {
    role: "MEMBER",
  };

  if (idStr) {
    const idNum = Number(idStr);
    if (!Number.isNaN(idNum)) {
      where.id = idNum;
    }
  }

  if (nameStr) {
    where.name = {
      contains: nameStr,
      mode: "insensitive",
    };
  }

  if (emailStr) {
    where.email = {
      contains: emailStr,
      mode: "insensitive",
    };
  }

  // 🔹 並び順（一覧と同じルール）
  let orderBy: any;
  switch (sortStr) {
    case "id_asc":
      orderBy = { id: "asc" };
      break;
    case "id_desc":
      orderBy = { id: "desc" };
      break;
    case "createdAt_asc":
      orderBy = { createdAt: "asc" };
      break;
    case "createdAt_desc":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const members = await prisma.user.findMany({
    where,
    orderBy,
  });

  // 🔹 CSV ヘッダ
  const header = [
    "id",
    "name",
    "email",
    "postalCode",
    "address",
    "phone",
    "role",
    "isActive",
    "lastLoginAt",
    "createdAt",
    "updatedAt",
  ];

  // CSV用に値をエスケープ（ダブルクォートで囲んで " を "" に）
  const escapeCsv = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    const str =
      typeof value === "bigint" ? value.toString() : String(value);
    const replaced = str.replace(/"/g, '""');
    return `"${replaced}"`;
  };

  const rows = members.map((u) => {
    return [
      escapeCsv(u.id), // BigInt → string にも対応
      escapeCsv(u.name),
      escapeCsv(u.email),
      escapeCsv(u.postalCode),
      escapeCsv(u.address),
      escapeCsv(u.phone),
      escapeCsv(u.role),
      escapeCsv(u.isActive ? "1" : "0"),
      escapeCsv(
        u.lastLoginAt ? u.lastLoginAt.toISOString() : ""
      ),
      escapeCsv(u.createdAt.toISOString()),
      escapeCsv(u.updatedAt.toISOString()),
    ].join(",");
  });

// ★ Excel 文字化け対策：UTF-8 BOM を付与する
const bom = "\uFEFF";

// CSV 本体
const csvBody = [header.join(","), ...rows].join("\r\n");

// BOM + CSV
const csvContent = bom + csvBody;

  // ファイル名例: members_20251119_153045.csv
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const filename = `members_${now.getFullYear()}${pad(
    now.getMonth() + 1
  )}${pad(now.getDate())}_${pad(now.getHours())}${pad(
    now.getMinutes()
  )}${pad(now.getSeconds())}.csv`;

  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
