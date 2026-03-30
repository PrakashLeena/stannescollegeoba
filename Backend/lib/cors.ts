import { NextResponse } from 'next/server'

function parseOrigins() {
  const raw = process.env.CORS_ORIGINS || ''
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function withCors(req: Request, res: NextResponse) {
  const origin = req.headers.get('origin')
  const allowlist = parseOrigins()

  if (origin && (allowlist.length === 0 || allowlist.includes(origin))) {
    res.headers.set('Access-Control-Allow-Origin', origin)
    res.headers.set('Vary', 'Origin')
  }

  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return res
}

export function handleOptions(req: Request) {
  return withCors(req, new NextResponse(null, { status: 204 }))
}
