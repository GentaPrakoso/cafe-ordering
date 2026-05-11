const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getAllOrders);
router.get('/my', auth, role('customer'), orderController.getMyOrders);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id/status', auth, role('admin', 'kasir', 'kitchen'), orderController.updateStatus);
router.get('/public/:id', orderController.getOrderById); // tanpa auth

module.exports = router;