const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const userResponse = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role
});

const createToken = (admin) => jwt.sign(
  { id: admin._id.toString(), email: admin.email, role: admin.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await Admin.create({
      name: name || 'Blue Chalk Admin',
      email: normalizedEmail,
      passwordHash,
      role: 'admin'
    });

    return res.status(201).json({ success: true, user: userResponse(admin) });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    const passwordMatches = admin && await bcrypt.compare(password, admin.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'JWT_SECRET is not configured' });
    }

    return res.json({
      success: true,
      message: 'Login successful',
      token: createToken(admin),
      user: userResponse(admin)
    });
  } catch (error) {
    return next(error);
  }
};

const me = (req, res) => res.json({ success: true, user: userResponse(req.user) });

module.exports = { signup, login, me };