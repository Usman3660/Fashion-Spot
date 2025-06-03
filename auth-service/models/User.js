// auth-service/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String }, // Added for Google Login and general use
  email: { type: String, required: true, unique: true, index: true }, // Added index for query performance
  password: { type: String, required: true }, // Will be a placeholder for pure OAuth users
  avatar: { type: String }, // Added for Google Login
  isOAuthUser: { type: Boolean, default: false }, // To distinguish OAuth users
  role: { type: String, enum: ['admin', 'customer', 'brand'], default: 'customer' },
  resetToken: String,
  resetTokenExpires: Date,
}, { timestamps: true }); // Added timestamps for createdAt/updatedAt

// Password Hashing
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new) AND it's not an OAuth user
  // with a placeholder password (or if the password field itself wasn't the one modified for an OAuth user)
  if (!this.isModified('password') || (this.isOAuthUser && this.password.startsWith('oauth-'))) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);