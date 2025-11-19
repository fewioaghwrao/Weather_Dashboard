// src/app/member/profile/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import MemberProfileForm from "@/components/MemberProfileForm";
import { prisma } from "@/lib/prisma";

export default async function MemberProfilePage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect("/auth/login");
  }

  // SessionUser の id を使って DB からフル情報を取得
  const dbUser = await prisma.user.findUnique({
    where: { id: BigInt(sessionUser.id) }, // id が string の前提
  });

  if (!dbUser) {
    // ありえないけど一応
    redirect("/auth/login");
  }

  return (
    <main className="p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-xl">
        <h1 className="text-xl md:text-2xl font-bold mb-4">会員情報の編集</h1>
        <MemberProfileForm
          initialUser={{
            id: dbUser.id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            postalCode: dbUser.postalCode ?? "",
            address: dbUser.address ?? "",
            phone: dbUser.phone ?? "",
          }}
        />
      </div>
    </main>
  );
}
