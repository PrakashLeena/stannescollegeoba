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
      .collection('events')
      .find(
        { isPublished: true },
        { projection: { title: 1, slug: 1, description: 1, location: 1, startDate: 1, endDate: 1, imageUrl: 1, createdAt: 1 } }
      )
      .sort({ startDate: -1, createdAt: -1 })
      .limit(200)
      .toArray()

    return withCors(req, NextResponse.json({ ok: true, items }))
  } catch {
    return withCors(req, NextResponse.json({ ok: false, error: 'Request failed' }, { status: 500 }))
  }
}
