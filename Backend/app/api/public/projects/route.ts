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
      .collection('projects')
      .find(
        { isPublished: true },
        { projection: { title: 1, slug: 1, summary: 1, content: 1, imageUrl: 1, createdAt: 1 } }
      )
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray()

    return withCors(req, NextResponse.json({ ok: true, items }))
  } catch {
    return withCors(req, NextResponse.json({ ok: false, error: 'Request failed' }, { status: 500 }))
  }
}
