import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  if (!cached.promise) {
    console.log('Connecting to MongoDB');
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'Groove',
      bufferCommands: false,
    }).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
    }).catch((err) => {
      console.error('Error connecting to MongoDB:', err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
