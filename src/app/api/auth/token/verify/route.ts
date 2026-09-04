import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getUserFromRequest(req)
  return NextResponse.json({ valid: !!session })
}
