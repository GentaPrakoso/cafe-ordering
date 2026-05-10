const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, register, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], login);

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['customer', 'admin', 'kasir', 'kitchen'])
], register);

router.get('/me', auth, getMe);

module.exports = router;