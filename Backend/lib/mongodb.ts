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

  // IMPORTANT: Do not call client.connect() at import/build time.
  // The MongoDB driver will establish a connection lazily when the first operation runs.
  const client = new MongoClient(uri, options)
  return Promise.resolve(client)
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
