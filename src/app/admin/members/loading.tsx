// src/app/admin/members/loading.tsx

export default function AdminMembersLoading() {
  return (
    <main className="space-y-6 p-4 md:p-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold mb-1">会員一覧</h1>
          <p className="text-sm text-slate-600">
            一般会員数を取得しています…
          </p>
        </div>
      </header>

      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 space-y-3">
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                {["ID", "氏名", "メールアドレス", "権限", "アカウント", "詳細", "登録日"].map(
                  (h) => (
                    <th key={h} className="px-3 py-2 border-b">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: 7 }).map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-3 py-2 border-b"
                    >
                      <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-slate-600">
          <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="w-16 h-7 bg-slate-100 rounded animate-pulse" />
            <div className="w-16 h-7 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </section>
    </main>
  );
}
