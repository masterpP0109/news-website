
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached = (global as typeof globalThis & { mongoose: MongooseCache }).mongoose;

if (!cached) {
  cached = (global as typeof globalThis & { mongoose: MongooseCache }).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB Atlas successfully');
      console.log('Database:', mongoose.connection.db?.databaseName);
      return mongoose;
    }).catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.error('Please check your MONGODB_URI in .env.local');
      console.error('Make sure your IP address is whitelisted in MongoDB Atlas');
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Export a mongoose instance connecting to MongoDB which is already connected
export default mongoose;

// Export the clientPromise for MongoDB client usage
export { clientPromise };
