const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./src/models/Admin');

let connectionPromise;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
  await ensureDefaultAdmin();
  return mongoose.connection;
};

const ensureDefaultAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || 'admin@bluechalk.com').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 12);

  await Admin.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        name: 'Blue Chalk Admin',
        email,
        passwordHash,
        role: 'admin'
      }
    },
    { upsert: true, setDefaultsOnInsert: true, returnDocument: 'after' }
  );
};

module.exports = connectDB;
