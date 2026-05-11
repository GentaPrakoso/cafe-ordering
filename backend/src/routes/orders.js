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
router.get('/public/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT o.*, p.method as payment_method FROM orders o LEFT JOIN payments p ON o.id = p.order_id WHERE o.id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Order not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;