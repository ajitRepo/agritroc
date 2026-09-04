import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { randomInt } from 'crypto'
import { prisma } from './prisma'

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || 'agritroc-default-fallback-jwt-secret-key-32-chars'
  return new TextEncoder().encode(secret)
}

export interface JwtPayload {
  userId: string
  phone: string
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret())
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as unknown as JwtPayload
  } catch {
    return null
  }
}

export async function getSessionUser(): Promise<JwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value || cookieStore.get('access_token')?.value
  if (!token) return null
  return verifyToken(token)
}

const PRESENCE_THROTTLE_MS = 2 * 60 * 1000

function touchLastSeen(userId: string): void {
  const seuil = new Date(Date.now() - PRESENCE_THROTTLE_MS)
  prisma.user
    .updateMany({
      where: {
        id: userId,
        OR: [{ lastSeenAt: null }, { lastSeenAt: { lt: seuil } }],
      },
      data: { lastSeenAt: new Date() },
    })
    .catch(() => {})
}

export async function getUserFromRequest(req: NextRequest): Promise<JwtPayload | null> {
  // Check Authorization header first (for mobile app & API clients)
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const payload = await verifyToken(token)
    if (payload) touchLastSeen(payload.userId)
    return payload
  }

  // Check cookies
  const cookieToken = req.cookies.get('token')?.value || req.cookies.get('access_token')?.value
  if (cookieToken) {
    const payload = await verifyToken(cookieToken)
    if (payload) touchLastSeen(payload.userId)
    return payload
  }

  return null
}

export function generateOTP(): string {
  return randomInt(100000, 999999).toString()
}
