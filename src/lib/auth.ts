import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function getTokenFromRequest(req: NextRequest): string | null {
  // Check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  // Check cookie
  const cookie = req.cookies.get("token");
  return cookie?.value ?? null;
}

export async function getAuthUser(req: NextRequest): Promise<JwtPayload | null> {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}
