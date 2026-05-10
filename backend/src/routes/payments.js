const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.post('/create', auth, paymentController.createTransaction);
router.post('/callback', paymentController.paymentCallback);

module.exports = router;