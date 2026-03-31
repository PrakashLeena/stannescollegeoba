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

    const items = await db
      .collection('committeeMembers')
      .find({}, { projection: { name: 1, role: 1, order: 1, imageUrl: 1, bio: 1 } })
      .sort({ order: 1, createdAt: -1 })
      .limit(200)
      .toArray()

    return withCors(req, NextResponse.json({ ok: true, items }))
  } catch {
    return withCors(req, NextResponse.json({ ok: false, error: 'Request failed' }, { status: 500 }))
  }
}
