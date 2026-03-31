import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { handleOptions, withCors } from '@/lib/cors'

export const runtime = 'nodejs'

export async function OPTIONS(req: Request) {
  return handleOptions(req)
}

export async function GET(req: Request) {
  try {
    const db = await getDb()
    const count = await db.collection('members').countDocuments({ isActive: true })
    return withCors(req, NextResponse.json({ ok: true, count }))
  } catch {
    return withCors(req, NextResponse.json({ ok: false, error: 'Request failed' }, { status: 500 }))
  }
}
