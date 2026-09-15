const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);
 

dotenv.config();

// ✅ IMPORT ROUTES
const homeRoutes = require('./src/routes/homeRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const footerRoutes = require('./src/routes/footerRoutes');
const newsRoutes = require('./src/routes/newsRoutes');
const newsimageRoutes = require('./src/routes/newsimageRoutes');
const workRoutes = require('./src/routes/workRoutes');
// Import routes from about folder
const aboutRoutes = require('./src/routes/about/aboutRoutes');
const galleryRoutes = require('./src/routes/about/galleryRoutes');
const clientLogoRoutes = require('./src/routes/about/clientLogoRoutes');
const awardRoutes = require('./src/routes/about/awardRoutes');
const teamRoutes = require('./src/routes/about/teamRoutes');


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
app.use('/api/footer', footerRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/upload', newsimageRoutes);
app.use('/api/work', workRoutes);
// Use routes about
app.use('/api/about', aboutRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/clients', clientLogoRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/team', teamRoutes);





app.get('/', (req, res) => {
  res.json({
    message: 'BlueChalk API is running 🚀',
    endpoints: {
      home: '/api/home',
      contact: '/api/contact',
      footer: '/api/footer',
      news: '/api/news',
      work: '/api/work',
      about: '/api/about',
      gallery: '/api/gallery',
      clients: '/api/clients',
      awards: '/api/awards',
      team: '/api/team'
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