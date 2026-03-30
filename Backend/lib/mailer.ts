import nodemailer from 'nodemailer'

export function getTransport() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !port || !user || !pass) {
    throw new Error('Missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  })
}

export async function sendAdminEmail(opts: { subject: string; text: string }) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return

  const from = process.env.MAIL_FROM || adminEmail

  const transport = getTransport()
  await transport.sendMail({
    from,
    to: adminEmail,
    subject: opts.subject,
    text: opts.text,
  })
}
