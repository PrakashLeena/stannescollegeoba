import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { handleOptions, withCors } from '@/lib/cors'

export const runtime = 'nodejs'

export async function OPTIONS(req: Request) {
  return handleOptions(req)
}

export async function GET(req: Request, ctx: { params: { slug: string } }) {
  try {
    const slug = ctx.params.slug
    const db = await getDb()

    const item = await db.collection('projects').findOne({ slug, isPublished: true })
    if (!item) {
      return withCors(req, NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 }))
    }

    return withCors(req, NextResponse.json({ ok: true, item }))
  } catch {
    return withCors(req, NextResponse.json({ ok: false, error: 'Request failed' }, { status: 500 }))
  }
}
