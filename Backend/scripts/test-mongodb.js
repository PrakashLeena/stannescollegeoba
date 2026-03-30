const fs = require('fs')
const path = require('path')
const { MongoClient, ServerApiVersion } = require('mongodb')

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

const envLocal = path.join(process.cwd(), '.env.local')
const env = path.join(process.cwd(), '.env')
loadDotEnv(envLocal)
loadDotEnv(env)

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'admin'

function sanitizeMongoUri(value) {
  if (!value) return value
  return value.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)(@)/, '$1***$3')
}

function printDiagnostics(value) {
  if (!value) return
  const trimmed = value.trim()

  if (trimmed.includes('MONGODB_URI=')) {
    console.error('⚠ Your MONGODB_URI value contains "MONGODB_URI=" inside it. Remove the duplicated prefix.')
  }

  if (trimmed.endsWith('.')) {
    console.error('⚠ Your MONGODB_URI ends with a dot (.). Remove the trailing dot.')
  }

  if (!trimmed.startsWith('mongodb+srv://')) {
    console.error('⚠ MONGODB_URI should start with mongodb+srv://')
  }

  // Common mistake: password contains an unencoded @ which breaks the URI.
  // If there are 2 or more @ signs, it is very likely the password has an @ that must be URL-encoded as %40.
  const atCount = (trimmed.match(/@/g) || []).length
  if (atCount >= 2) {
    console.error('⚠ Your URI contains multiple "@" symbols. If your password contains @, URL-encode it as %40.')
  }
}

console.log(`Using MONGODB_DB: ${dbName}`)
console.log(`Using MONGODB_URI: ${sanitizeMongoUri(uri)}`)
printDiagnostics(uri)

if (!uri) {
  console.error('Missing MONGODB_URI. Put it in Backend/.env.local or set it in your shell env.')
  process.exit(1)
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    await client.connect()
    await client.db(dbName).command({ ping: 1 })
    console.log(`✅ MongoDB connected. Ping ok. DB: ${dbName}`)
  } finally {
    await client.close()
  }
}

run().catch((err) => {
  console.error('❌ MongoDB connection test failed')
  console.error(err)
  process.exitCode = 1
})
