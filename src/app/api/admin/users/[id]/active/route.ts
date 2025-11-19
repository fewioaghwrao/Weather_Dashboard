// src/app/api/admin/users/[id]/active/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ★ params は Promise
) {
  const { id: idParam } = await context.params; // ★ await 必須

  const idNum = Number(idParam);
  if (Number.isNaN(idNum)) {
    return NextResponse.json(
      { error: "不正なユーザーIDです。" },
      { status: 400 }
    );
  }

  // TODO: 認証・認可チェック（管理者のみ許可など）

  const user = await prisma.user.findUnique({
    where: { id: idNum },
  });

  if (!user) {
    return NextResponse.json(
      { error: "ユーザーが見つかりません。" },
      { status: 404 }
    );
  }

  // isActive をトグル
  const updated = await prisma.user.update({
    where: { id: idNum },
    data: {
      isActive: !user.isActive,
    },
    select: {
      id: true,
      isActive: true,
    }, // ★ 必要なフィールドだけ取得
  });

  // ★ BigInt を Number に変換してから返す
  return NextResponse.json({
    id: Number(updated.id),
    isActive: updated.isActive,
  });
}
