import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const isDummyURI = MONGODB_URI.includes('username:password') || MONGODB_URI.includes('<') || MONGODB_URI.includes('>');
    const connectWithFallback = async () => {
      try {
        if (isDummyURI) throw new Error('Dummy URI provided');
        const conn = await mongoose.connect(MONGODB_URI, { bufferCommands: false });
        console.log('✅ Connected to remote MongoDB successfully.');
        return conn;
      } catch (err: any) {
        // If it's an auth error, don't silently fall back - surface it clearly
        const isAuthError =
          err?.message?.includes('bad auth') ||
          err?.message?.includes('authentication failed') ||
          err?.code === 18;

        if (isAuthError) {
          console.error('❌ MongoDB Authentication Failed. Please check your MONGODB_URI credentials in .env.local');
          throw new Error(
            'MongoDB authentication failed. Please update your database password in .env.local'
          );
        }

        if (process.env.NODE_ENV !== 'production') {
          console.warn('⚠️ Could not connect to remote MongoDB (or dummy URI used). Falling back to Memory Server...');
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          const mongoServer = await MongoMemoryServer.create();
          const memoryUri = mongoServer.getUri();
          console.log('✅ Using MongoDB Memory Server at', memoryUri);
          return await mongoose.connect(memoryUri, { bufferCommands: false });
        }
        throw err;
      }
    };

    cached.promise = connectWithFallback();
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
