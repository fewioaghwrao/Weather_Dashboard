// src/lib/auth.ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret");
const alg = "HS256";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  // ★ Next.js 16 では cookies() が Promise になっている
  const cookieStore = await cookies();  
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey, { algorithms: [alg] });

    return {
      id: Number(payload.sub),
      name: String(payload.name),
      email: String(payload.email),
      role: String(payload.role),
    };
  } catch (e) {
    console.error("Invalid session token", e);
    return null;
  }
}

