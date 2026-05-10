const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, role('admin', 'kasir'), voucherController.getAll);
router.post('/', auth, role('admin'), voucherController.create);
router.put('/:id', auth, role('admin'), voucherController.update);
router.delete('/:id', auth, role('admin'), voucherController.delete);
router.post('/validate', auth, voucherController.validate);

module.exports = router;