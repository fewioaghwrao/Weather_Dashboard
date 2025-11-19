/**
 * @jest-environment node
 */
import { prisma } from "@/lib/prisma";

describe("Prisma User モデル", () => {
  let testUserEmail = "test-user@example.com";

  afterAll(async () => {
    // 後片付け
    await prisma.user.deleteMany({
      where: { email: testUserEmail },
    });
    await prisma.$disconnect();
  });

  it("メールアドレスでユーザーを検索できる", async () => {
    // まずテスト用ユーザーを作る
    const created = await prisma.user.create({
      data: {
        name: "テストユーザー",
        email: testUserEmail,
        passwordHash: "dummy",
        role: "MEMBER",
        isActive: true,
      },
    });

    const user = await prisma.user.findFirst({
      where: { email: testUserEmail },
    });

    expect(user).not.toBeNull();
    if (!user) return;

    expect(user.id).toBe(created.id);
    expect(user.email).toBe(testUserEmail);
  });

  it("アカウント有効/無効フラグが切り替わる", async () => {
    const user = await prisma.user.findFirst({
      where: { email: testUserEmail },
    });

    expect(user).not.toBeNull();
    if (!user) return;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { isActive: !user.isActive },
    });

    expect(updated.isActive).toBe(!user.isActive);

    // 元に戻す
    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: user.isActive },
    });
  });
});
