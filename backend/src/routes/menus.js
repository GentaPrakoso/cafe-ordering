const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../utils/upload'); // simple multer setup

// Public
router.get('/', menuController.getAll);
router.get('/:id', menuController.getById);

// Admin / Kasir
router.post('/', auth, role('admin', 'kasir'), upload.single('image'), menuController.create);
router.put('/:id', auth, role('admin', 'kasir'), upload.single('image'), menuController.update);
router.delete('/:id', auth, role('admin', 'kasir'), menuController.delete);

module.exports = router;