import mongoose from 'mongoose';

/**
 * lib/mongodb.ts
 *
 * Mongoose connection manager with global connection caching for Next.js.
 * Spec: api.md §6 & §7
 *
 * HARD CONSTRAINT:
 * Only used for Updates (blog). Forms NEVER connect to this database (api.md §1 & §6).
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export function setMongooseConnectionForTesting(conn: unknown) {
  global.mongooseCache = {
    conn: conn as typeof mongoose | null,
    promise: conn ? Promise.resolve(conn as typeof mongoose) : null,
  };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  const cache = global.mongooseCache!;

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cache.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}
