const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/UserController');
const {
  validateRegister,
  validateLogin,
} = require('../middleware/Validation');
const { protect } = require('../middleware/Auth');

// Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);

module.exports = router;
