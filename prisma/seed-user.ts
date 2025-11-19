// prisma/seed-user.ts
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();  // ← ここで直接インスタンス生成


async function main() {
  const password = "Test1234"; // ログインに使う平文パスワード
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "一般ユーザー",
      email: "user@example.com",
      postalCode: "123-4567",
      address: "東京都サンプル区1-2-3",
      phone: "090-0000-0000",
      passwordHash: hash,
      role: UserRole.MEMBER,
      isActive: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "管理者ユーザー",
      email: "admin@example.com",
      postalCode: "123-4567",
      address: "東京都管理者区1-2-3",
      phone: "090-1111-1111",
      passwordHash: hash, // 同じ "Test1234"
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log("Seeded users:", { user, admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
