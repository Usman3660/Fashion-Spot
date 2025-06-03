// auth-service/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { OAuth2Client } = require('google-auth-library'); // Not strictly needed for current googleLogin logic
const crypto = require('crypto');
const { sendResetEmail } = require('../services/emailService'); // Make sure this service exists
const redisClient = require('../config/redis'); // Import Redis client

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // This OAuth2Client instance is not used in the current googleLogin

const JWT_EXPIRY_STRING = '1h';
const JWT_EXPIRY_SECONDS = 3600; // 1 hour in seconds, should match JWT_EXPIRY_STRING

// ───────────────────────────
// ✅ Auth Functions
// ───────────────────────────

const register = async (req, res) => {
  const { email, password, role, name } = req.body; // Added name to register
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRY_STRING }
    );

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const cacheKey = `login:${email}`;

  try {
    // 1. Check cache first
    if (redisClient.isReady) {
      const cachedToken = await redisClient.get(cacheKey);
      if (cachedToken) {
        console.log('Login: Cache hit for user:', email);
        return res.status(200).json({ message: 'Login successful (from cache)', token: cachedToken });
      }
      console.log('Login: Cache miss for user:', email);
    } else {
      console.warn('Redis not ready, skipping cache for login.');
    }

    // 2. If not in cache, proceed with database query
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isOAuthUser && !password) { // User signed up with Google, trying to log in with email without password
        return res.status(400).json({ message: 'Please log in using your Google account.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRY_STRING }
    );

    // 3. Cache the new token
    if (redisClient.isReady) {
      await redisClient.set(cacheKey, token, {
        EX: JWT_EXPIRY_SECONDS, // Set expiration in seconds
      });
      console.log('Login: Token cached for user:', email);
    }

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

const googleLogin = async (req, res) => {
  const { name, email, picture } = req.body; // Frontend sends decoded Google token info
  const cacheKey = `google-login:${email}`;

  try {
    // 1. Check cache first
    if (redisClient.isReady) {
      const cachedToken = await redisClient.get(cacheKey);
      if (cachedToken) {
        console.log('Google Login: Cache hit for user:', email);
        return res.status(200).json({ message: 'Google login success (from cache)', token: cachedToken });
      }
      console.log('Google Login: Cache miss for user:', email);
    } else {
      console.warn('Redis not ready, skipping cache for Google login.');
    }

    let user = await User.findOne({ email });
    if (!user) {
      // Create new user for Google sign-in
      user = await User.create({
        email,
        name,
        avatar: picture,
        password: `oauth-${crypto.randomBytes(16).toString('hex')}`, // Unique, unguessable placeholder
        role: 'customer',
        isOAuthUser: true, // Mark as OAuth user
      });
    } else {
      // User exists, update details if necessary and mark as OAuth capable
      let needsSave = false;
      if (!user.isOAuthUser) {
        user.isOAuthUser = true;
        needsSave = true;
      }
      if (name && user.name !== name) {
        user.name = name;
        needsSave = true;
      }
      if (picture && user.avatar !== picture) {
        user.avatar = picture;
        needsSave = true;
      }
      // If user originally signed up with email/pass, their password remains.
      // They can now log in via Google or email/pass.
      if (needsSave) {
        await user.save();
      }
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRY_STRING }
    );

    // 3. Cache the new token
    if (redisClient.isReady) {
      await redisClient.set(cacheKey, token, {
        EX: JWT_EXPIRY_SECONDS,
      });
      console.log('Google Login: Token cached for user:', email);
    }

    res.status(200).json({ message: 'Google login success', token });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Google login failed', error: err.message });
  }
};

// ───────────────────────────
// ✅ Password Reset
// ───────────────────────────

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isOAuthUser && user.password.startsWith('oauth-')) {
        return res.status(400).json({ message: 'Password reset is not available for accounts created via Google Sign-In using this method. Please use Google recovery if needed.' });
    }


    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendResetEmail(user.email, resetLink); // Ensure emailService is correctly set up

    res.json({ message: 'Reset link sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Failed to send reset email', error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = newPassword; // Setter will trigger pre-save hook for hashing
    user.isOAuthUser = false; // If they reset password, they are now a regular user
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    // Invalidate cached login tokens for this user
    if (redisClient.isReady) {
      const loginCacheKey = `login:${user.email}`;
      const googleLoginCacheKey = `google-login:${user.email}`;
      await redisClient.del([loginCacheKey, googleLoginCacheKey]); // Can delete multiple keys
      console.log(`Password Reset: Invalidated cache for user ${user.email}`);
    }

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};

// ───────────────────────────
// ✅ Admin-only Functions
// ───────────────────────────

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Invalidate cached login tokens for this user
    if (redisClient.isReady && user.email) {
      const loginCacheKey = `login:${user.email}`;
      const googleLoginCacheKey = `google-login:${user.email}`;
      await redisClient.del([loginCacheKey, googleLoginCacheKey]);
      console.log(`User Deletion: Invalidated cache for user ${user.email}`);
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

// ───────────────────────────
// ✅ Export All
// ───────────────────────────

module.exports = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  getAllUsers,
  deleteUserById,
};