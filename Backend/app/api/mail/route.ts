import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getTransport } from '@/lib/mailer'
import { handleOptions, withCors } from '@/lib/cors'

export const runtime = 'nodejs'

const schema = z.object({
  to: z.string().email().max(320),
  subject: z.string().min(1).max(200),
  text: z.string().min(1).max(10000),
})

function isAuthorized(req: Request) {
  const expected = process.env.MAIL_API_TOKEN
  if (!expected) return false

  const auth = req.headers.get('authorization') || ''
  const m = auth.match(/^Bearer\s+(.+)$/i)
  if (!m) return false

  return m[1] === expected
}

export async function OPTIONS(req: Request) {
  return handleOptions(req)
}

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return withCors(req, NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 }))
    }

    const json = await req.json()
    const data = schema.parse(json)

    const from = process.env.MAIL_FROM || process.env.ADMIN_EMAIL || process.env.SMTP_USER
    if (!from) {
      return withCors(
        req,
        NextResponse.json(
          { ok: false, error: 'Missing MAIL_FROM (or ADMIN_EMAIL/SMTP_USER)' },
          { status: 500 }
        )
      )
    }

    const transport = getTransport()
    await transport.sendMail({
      from,
      to: data.to,
      subject: data.subject,
      text: data.text,
    })

    return withCors(req, NextResponse.json({ ok: true }))
  } catch {
    return withCors(req, NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 }))
  }
}
