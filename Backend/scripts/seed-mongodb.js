const bcrypt = require('bcryptjs')
const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')

function loadDotEnv(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      const key = trimmed.slice(0, idx).trim()
      let value = trimmed.slice(idx + 1).trim()

      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      if (process.env[key] === undefined) {
        process.env[key] = value
      }
    }
  } catch {
    // ignore
  }
}

loadDotEnv(path.join(process.cwd(), '.env.local'))
loadDotEnv(path.join(process.cwd(), '.env'))

async function main() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB

  const adminEmail = (process.env.SEED_ADMIN_EMAIL || process.env.ADMIN_EMAIL || '').toLowerCase().trim()
  const adminPassword = process.env.SEED_ADMIN_PASSWORD

  const editorEmail = (process.env.SEED_EDITOR_EMAIL || '').toLowerCase().trim()
  const editorPassword = process.env.SEED_EDITOR_PASSWORD

  if (!uri) throw new Error('Missing MONGODB_URI')
  if (!adminEmail || !adminPassword) {
    throw new Error('Missing SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD (or ADMIN_EMAIL + SEED_ADMIN_PASSWORD)')
  }

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)

  const users = db.collection('users')

  const adminHash = await bcrypt.hash(adminPassword, 10)
  await users.updateOne(
    { email: adminEmail },
    {
      $set: {
        email: adminEmail,
        name: 'Admin',
        role: 'ADMIN',
        passwordHash: adminHash,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  )

  if (editorEmail && editorPassword) {
    const editorHash = await bcrypt.hash(editorPassword, 10)
    await users.updateOne(
      { email: editorEmail },
      {
        $set: {
          email: editorEmail,
          name: 'Editor',
          role: 'EDITOR',
          passwordHash: editorHash,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    )
  }

  await db.collection('siteSettings').updateOne(
    { _id: 'default' },
    {
      $setOnInsert: {
        siteName: "ST.ANNE'S COLLEGE OLD BOYS ASSOCIATION",
        siteTagline: 'IN NSW & ACT',
        email: 'stannesppa.official@gmail.com',
        phone: '+94',
        address: 'Vankalai, Mannar, Sri Lanka',
        createdAt: new Date(),
      },
      $set: { updatedAt: new Date() },
    },
    { upsert: true }
  )

  console.log('MongoDB seed completed')
  await client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
