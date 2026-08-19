const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// ✅ IMPORT ROUTES
const homeRoutes = require('./src/routes/homeRoutes');
const contactRoutes = require('./src/routes/contactRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// ✅ ROUTES
app.use('/api/home', homeRoutes);
app.use('/api/contact', contactRoutes);

// Test Route
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'BlueChalk API is running 🚀',
//     endpoints: {
//       home: '/api/home'
//     }
//   });
// });


// ✅ TEST ROUTE - SIRF EK BAAR
app.get('/', (req, res) => {
  res.json({ 
    message: 'BlueChalk API is running 🚀',
    endpoints: {
      home: '/api/home',
      contact: '/api/contact'
    }
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});