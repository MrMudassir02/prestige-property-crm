import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "please define the MONGODB_URI enviroment variable in .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    Promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.Promise) {
    cached.Promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.Promise

  return cached.conn
}
