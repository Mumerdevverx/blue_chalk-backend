const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./src/models/Admin');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cached.promise || mongoose.connection.readyState === 0) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts)
      .then((m) => {
        console.log(`MongoDB connected: ${m.connection.name}`);
        // Run default admin initialization asynchronously without blocking if already done
        ensureDefaultAdmin().catch((err) => console.error('Default admin check failed:', err.message));
        return m.connection;
      })
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  await cached.promise;
  return mongoose.connection;
};

const ensureDefaultAdmin = async () => {
  try {
    const email = (process.env.ADMIN_EMAIL || 'admin@bluechalk.com').trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hasExplicitBootstrapCredentials = Boolean(
      process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD
    );
    const existing = await Admin.findOne({ email }).select('+passwordHash');

    if (existing) {
      if (
        !existing.isTrustedAdmin &&
        hasExplicitBootstrapCredentials &&
        await bcrypt.compare(password, existing.passwordHash)
      ) {
        existing.isTrustedAdmin = true;
        await existing.save();
      }

      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await Admin.create({
      name: 'Blue Chalk Admin',
      email,
      passwordHash,
      role: 'admin',
      isTrustedAdmin: hasExplicitBootstrapCredentials
    });
    console.log('Default admin created successfully');
  } catch (error) {
    console.error('ensureDefaultAdmin error:', error.message);
  }
};

module.exports = connectDB;
