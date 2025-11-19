// src/app/admin/members/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminUserActiveButton from "@/components/AdminUserActiveButton"; 
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 5;

// Next.js 16 の searchParams は Promise
type RawSearchParams = {
  [key: string]: string | string[] | undefined;
};

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const raw = await searchParams;

  // string | string[] | undefined → string に正規化
  const normalize = (v: string | string[] | undefined): string => {
    if (Array.isArray(v)) return (v[0] ?? "").toString();
    return (v ?? "").toString();
  };

  const pageStr = normalize(raw.page) || "1";
  const idStr = normalize(raw.id).trim();
  const nameStr = normalize(raw.name).trim();
  const emailStr = normalize(raw.email).trim();
  const sortStr = normalize(raw.sort).trim() || "createdAt_desc"; // ★ 追加

  const pageNum = Math.max(Number(pageStr) || 1, 1);

  // 🔹 一覧用 where （一般＋管理者）
  const listWhere: any = {};
  // 例: listWhere.isActive = true; など

  if (idStr) {
    const parsedId = Number(idStr);
    if (!Number.isNaN(parsedId)) {
      listWhere.id = parsedId;
    }
  }
  if (nameStr) {
    listWhere.name = {
      contains: nameStr,
      mode: "insensitive",
    };
  }
  if (emailStr) {
    listWhere.email = {
      contains: emailStr,
      mode: "insensitive",
    };
  }

  // 🔹 並び順の決定
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

  // 🔹 一般会員数（role = "MEMBER"）
  const generalWhere: any = { role: "MEMBER" };
  const generalCount = await prisma.user.count({ where: generalWhere });

  // 🔹 一覧総件数（一般＋管理者）
  const totalCount = await prisma.user.count({ where: listWhere });
  const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1);
  const currentPage = Math.min(pageNum, totalPages);

  const users = await prisma.user.findMany({
    where: listWhere,
    orderBy, // ★ 並び順を適用
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  // ページネーション用クエリ文字列
  const buildQuery = (pageNum: number) => {
    const params = new URLSearchParams();
    params.set("page", String(pageNum));
    if (idStr) params.set("id", idStr);
    if (nameStr) params.set("name", nameStr);
    if (emailStr) params.set("email", emailStr);
    if (sortStr) params.set("sort", sortStr); // ★ sort も維持
    return params.toString();
  };

    // ★ CSVダウンロード用（page は付けない）
  const buildCsvQuery = () => {
    const params = new URLSearchParams();
    if (idStr) params.set("id", idStr);
    if (nameStr) params.set("name", nameStr);
    if (emailStr) params.set("email", emailStr);
    if (sortStr) params.set("sort", sortStr);
    return params.toString();
  };

  return (
    <main className="space-y-6">
      {/* ヘッダー */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold mb-1">会員一覧</h1>
          <p className="text-sm text-slate-600">
            一般会員数:{" "}
            <span className="font-semibold">{generalCount}</span> 名
          </p>
          <p className="text-xs text-slate-500">
            （一覧には管理者アカウントも含まれます）
          </p>
        </div>
        <form
          action="/api/auth/logout" // ← あなたのログアウトAPIに合わせて変更
          method="POST"
          className="self-start"
        >
  <div className="self-start">
    <LogoutButton />
  </div>
        </form>
      </header>

      {/* 検索フォーム ＋ 並び順 */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 space-y-3">
        <h2 className="text-sm font-semibold mb-1">検索・絞り込み</h2>
        <form
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
          method="GET"
          action="/admin/members"
        >
          <div>
            <label className="block text-xs font-semibold mb-1">会員ID</label>
            <input
              type="text"
              name="id"
              defaultValue={idStr}
              className="w-full border rounded px-2 py-1.5 text-sm"
              placeholder="例：1"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">氏名</label>
            <input
              type="text"
              name="name"
              defaultValue={nameStr}
              className="w-full border rounded px-2 py-1.5 text-sm"
              placeholder="部分一致OK"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              メールアドレス
            </label>
            <input
              type="text"
              name="email"
              defaultValue={emailStr}
              className="w-full border rounded px-2 py-1.5 text-sm"
              placeholder="部分一致OK"
            />
          </div>

          {/* 並び順 ＋ ボタン */}
          <div className="flex flex-col gap-2">
            <div>
              <label className="block text-xs font-semibold mb-1">
                並び順
              </label>
              <select
                name="sort"
                defaultValue={sortStr}
                className="w-full border rounded px-2 py-1.5 text-sm bg-white"
              >
                <option value="createdAt_desc">登録日 新しい順</option>
                <option value="createdAt_asc">登録日 古い順</option>
                <option value="id_asc">ID 昇順</option>
                <option value="id_desc">ID 降順</option>
              </select>
            </div>

            <div className="flex gap-2 mt-auto">
              <button
                type="submit"
                className="flex-1 py-2 rounded bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700"
              >
                検索・実行
              </button>
              <Link
                href="/admin/members"
                className="py-2 px-3 rounded border border-slate-300 text-sm text-slate-700 hover:bg-slate-50"
              >
                クリア
              </Link>
            </div>
          </div>
        </form>
      </section>

      {/* 会員一覧テーブル */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">会員一覧</h2>
          <Link
            href={`/admin/members/csv?${buildCsvQuery()}`}
            className="inline-flex items-center px-3 py-1.5 rounded border border-slate-300 text-xs md:text-sm text-slate-700 hover:bg-slate-100"
          >
            会員一覧CSVダウンロード
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="px-3 py-2 border-b">ID</th>
                <th className="px-3 py-2 border-b">氏名</th>
                <th className="px-3 py-2 border-b">メールアドレス</th>
                <th className="px-3 py-2 border-b">権限</th>
                <th className="px-3 py-2 border-b">アカウント</th>
                <th className="px-3 py-2 border-b">詳細</th>
                <th className="px-3 py-2 border-b whitespace-nowrap">
                  登録日
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-4 text-center text-slate-500"
                  >
                    該当する会員が見つかりませんでした。
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 border-b">{u.id}</td>
                    <td className="px-3 py-2 border-b">{u.name}</td>
                    <td className="px-3 py-2 border-b">{u.email}</td>
                    <td className="px-3 py-2 border-b">
                      {u.role === "ADMIN" ? "管理者" : "一般"}
                    </td>
                    <td className="px-3 py-2 border-b">
                      <AdminUserActiveButton
                      userId={u.id}
            　　　　　isActive={u.isActive}
            　　　　　isAdmin={u.role === "ADMIN"}
          　　　　　　/>
        　　　　　　　</td>
                <td className="px-3 py-2 border-b">
          <Link
            href={`/admin/members/${u.id.toString()}`}
            className="inline-flex items-center px-2 py-1 border rounded text-xs text-slate-700 hover:bg-slate-100"
          >
            詳細
          </Link>
        </td>
                    <td className="px-3 py-2 border-b text-xs text-slate-500">
                      {u.createdAt.toLocaleString("ja-JP")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        <div className="flex items-center justify-between mt-4 text-xs text-slate-600">
          <div>
            全 {totalCount} 件中 / ページ {currentPage} / {totalPages}
          </div>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/admin/members?${buildQuery(currentPage - 1)}`}
                className="px-3 py-1.5 border rounded hover:bg-slate-50"
              >
                前へ
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/admin/members?${buildQuery(currentPage + 1)}`}
                className="px-3 py-1.5 border rounded hover:bg-slate-50"
              >
                次へ
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
