import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const options = {}

let clientPromise: Promise<MongoClient>

function createClientPromise() {
  if (!uri) {
    return Promise.reject(new Error('Missing MONGODB_URI'))
  }

  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

  const client = new MongoClient(uri, options)

  // IMPORTANT:
  // - During `next build` (Vercel build phase), do NOT attempt any network access.
  // - At runtime (Vercel Serverless Function), connect so NextAuth adapter can use the client reliably.
  if (isBuildPhase) {
    return Promise.resolve(client)
  }

  return client.connect().then(() => client)
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise()
  }
  clientPromise = global._mongoClientPromise as Promise<MongoClient>
} else {
  clientPromise = createClientPromise()
}

export default clientPromise

export async function getDb() {
  const client = await clientPromise
  const dbName = process.env.MONGODB_DB || undefined
  return client.db(dbName)
}
