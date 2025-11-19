// src/app/admin/members/[id]/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ParamsPromise = Promise<{ id: string }>;

export default async function AdminMemberDetailPage({
  params,
}: {
  params: ParamsPromise; // Next.js 16 では Promise
}) {
  const { id } = await params;
  const idNum = Number(id);

  if (Number.isNaN(idNum)) {
    throw new Error("不正な会員IDです。");
  }

  const user = await prisma.user.findUnique({
    where: { id: idNum },
  });

  if (!user) {
    return (
      <main className="p-4 space-y-4">
        <h1 className="text-xl font-bold">会員詳細</h1>
        <p className="text-sm text-red-600">会員が見つかりませんでした。</p>
        <Link
          href="/admin/members"
          className="inline-flex items-center px-3 py-2 border rounded text-sm text-slate-700 hover:bg-slate-100"
        >
          会員一覧に戻る
        </Link>
      </main>
    );
  }

  return (
    <main className="p-4 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold mb-1">会員詳細</h1>
          <p className="text-sm text-slate-600">
            会員ID: <span className="font-semibold">{user.id.toString()}</span>
          </p>
        </div>
        <Link
          href="/admin/members"
          className="inline-flex items-center px-3 py-2 border rounded text-sm text-slate-700 hover:bg-slate-100"
        >
          一覧に戻る
        </Link>
      </div>

      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 space-y-4">
        <h2 className="text-sm font-semibold">基本情報</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="text-slate-500">氏名</dt>
            <dd className="font-semibold">{user.name}</dd>
          </div>

          <div>
            <dt className="text-slate-500">メールアドレス</dt>
            <dd className="font-semibold">{user.email}</dd>
          </div>

          <div>
            <dt className="text-slate-500">郵便番号</dt>
            <dd>{user.postalCode ?? "-"}</dd>
          </div>

          <div>
            <dt className="text-slate-500">住所</dt>
            <dd>{user.address ?? "-"}</dd>
          </div>

          <div>
            <dt className="text-slate-500">電話番号</dt>
            <dd>{user.phone ?? "-"}</dd>
          </div>

          <div>
            <dt className="text-slate-500">権限</dt>
            <dd>{user.role === "ADMIN" ? "管理者" : "一般"}</dd>
          </div>

          <div>
            <dt className="text-slate-500">アカウント状態</dt>
            <dd>{user.isActive ? "有効" : "無効"}</dd>
          </div>
        </dl>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 space-y-4">
        <h2 className="text-sm font-semibold">ログイン情報</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="text-slate-500">最終ログイン日時</dt>
            <dd>
              {user.lastLoginAt
                ? user.lastLoginAt.toLocaleString("ja-JP")
                : "-"}
            </dd>
          </div>

          <div>
            <dt className="text-slate-500">登録日</dt>
            <dd>{user.createdAt.toLocaleString("ja-JP")}</dd>
          </div>

          <div>
            <dt className="text-slate-500">最終更新日時</dt>
            <dd>{user.updatedAt.toLocaleString("ja-JP")}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
