import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const SECRET = process.env.JWT_SECRET || 'change-me-in-production-to-a-long-random-string';
const ALG = 'HS256';

const secretKey = new TextEncoder().encode(SECRET);

export interface AdminSession extends JWTPayload {
  uid: number;
  username: string;
}

// إصدار توكن جديد — مدته 7 أيام
export async function signSession(payload: AdminSession): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

// التحقق من التوكن وإرجاع البيانات
export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as AdminSession;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = 'admin_session';
