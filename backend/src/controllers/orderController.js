const pool = require('../config/db');
const generateOrderNumber = require('../utils/generateOrderNumber');
const getIO = require('../socket').getIO;

exports.createOrder = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { customer_name, table_number, type, items, voucher_code } = req.body;
    const orderNumber = generateOrderNumber();

    let total = 0;
    for (let item of items) {
      const [menu] = await conn.query('SELECT price FROM menus WHERE id = ?', [item.menu_id]);
      if (!menu.length) throw new Error(`Menu ${item.menu_id} not found`);
      total += menu[0].price * item.quantity;
    }

    const tax = total * 0.11;
    const serviceCharge = total * 0.05;
    let discount = 0;
    if (voucher_code) {
      const [vouch] = await conn.query('SELECT * FROM vouchers WHERE code = ? AND valid_from <= NOW() AND valid_until >= NOW()', [voucher_code]);
      if (vouch.length) {
        if (vouch[0].discount_percent) discount = total * vouch[0].discount_percent / 100;
        else if (vouch[0].discount_nominal) discount = vouch[0].discount_nominal;
        await conn.query('UPDATE vouchers SET used_count = used_count + 1 WHERE id = ?', [vouch[0].id]);
      }
    }
    const grandTotal = total + tax + serviceCharge - discount;

    const [orderResult] = await conn.query(
      'INSERT INTO orders (order_number, customer_name, table_number, type, total, tax, service_charge, discount, grand_total, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [orderNumber, customer_name, table_number, type, total, tax, serviceCharge, discount, grandTotal, 'pending_confirmation', 'pending']
    );
    const orderId = orderResult.insertId;

    for (let item of items) {
      const [menu] = await conn.query('SELECT price FROM menus WHERE id = ?', [item.menu_id]);
      await conn.query(
        'INSERT INTO order_items (order_id, menu_id, quantity, notes, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.menu_id, item.quantity, item.notes || '', menu[0].price]
      );
    }

    await conn.commit();

    // Emit new order to kitchen & admin
    const io = getIO();
    const [fullOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    io.to('admin').emit('new-order', fullOrder[0]);
    io.to('kitchen').emit('new-order', fullOrder[0]);

    res.status(201).json({ order_id: orderId, order_number: orderNumber });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    let query = 'SELECT * FROM orders ORDER BY created_at DESC';
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!orders.length) return res.status(404).json({ message: 'Order not found' });
    const [items] = await pool.query(
      `SELECT oi.*, m.name as menu_name, m.image FROM order_items oi 
       JOIN menus m ON oi.menu_id = m.id 
       WHERE oi.order_id = ?`, [req.params.id]
    );
    res.json({ ...orders[0], items });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending_confirmation', 'processing', 'cooking', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    const [updated] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);

    const io = getIO();
    io.to('kitchen').emit('order-status-updated', updated[0]);
    io.to('admin').emit('order-status-updated', updated[0]);

    res.json(updated[0]);
  } catch (err) {
    next(err);
  }
};