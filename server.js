const app = require('./api');
const connectDB = require('./db');

const PORT = process.env.PORT || 5000;

const connectWithRetry = async (attempt = 1) => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    const maxAttempts = 5;

    if (attempt >= maxAttempts) {
      console.error('MongoDB connection failed after retries:', error.message);
      process.exit(1);
    }

    const delay = attempt * 3000;
    console.error(`MongoDB connection failed. Retrying in ${delay / 1000}s...`, error.message);
    setTimeout(() => connectWithRetry(attempt + 1), delay);
  }
};

connectWithRetry();
