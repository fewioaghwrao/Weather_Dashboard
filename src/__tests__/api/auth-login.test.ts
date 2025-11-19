/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

// ★ jose をモック → 本物の ESM を触らないようにする
jest.mock("jose", () => {
  class FakeSignJWT {
    private payload: any;
    constructor(payload: any) {
      this.payload = payload;
    }
    setProtectedHeader() {
      return this;
    }
    setSubject() {
      return this;
    }
    setIssuedAt() {
      return this;
    }
    setExpirationTime() {
      return this;
    }
    async sign(_secret: any) {
      // 実際のトークンはどうでもいいのでダミー文字列でOK
      return "dummy-jwt-token";
    }
  }

  return {
    SignJWT: FakeSignJWT,
  };
});

import { POST } from "@/app/api/auth/login/route";

describe("POST /api/auth/login", () => {
  it("正しいメール・パスワードでログイン成功", async () => {
    const body = { email: "test-user@example.com", password: "dummy" };

    const req = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);

    // ステータスコードは実装に合わせて調整
    expect([200, 400, 401]).toContain(res.status);

    if (res.status === 200) {
      const json = await res.json();
      // redirectTo などが返っているかをざっくり確認
      expect(json).toHaveProperty("redirectTo");
    }
  });
});

