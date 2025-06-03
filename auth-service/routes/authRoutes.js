// auth-service/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Admin-only routes (protected)
router.get('/users', protect, authorize('admin'), authController.getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), authController.deleteUserById);

module.exports = router;