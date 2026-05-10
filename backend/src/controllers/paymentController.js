const midtransClient = require('midtrans-client');
const pool = require('../config/db');
const getIO = require('../socket').getIO;

let snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

exports.createTransaction = async (req, res, next) => {
  try {
    const { order_id, method } = req.body;
    if (!['qris', 'transfer', 'ewallet', 'cash'].includes(method)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [order_id]);
    if (!orders.length) return res.status(404).json({ message: 'Order not found' });
    const order = orders[0];

    if (method === 'cash') {
      await pool.query('UPDATE orders SET payment_status = ? WHERE id = ?', ['pending', order_id]);
      await pool.query('INSERT INTO payments (order_id, method, status, amount) VALUES (?, ?, ?, ?)', 
        [order_id, 'cash', 'pending', order.grand_total]);
      return res.json({ message: 'Cash payment recorded' });
    }

    const parameter = {
      transaction_details: {
        order_id: order.order_number,
        gross_amount: order.grand_total
      },
      credit_card: { secure: true }
    };

    if (method === 'qris') parameter.payment_type = 'gopay'; // Midtrans uses gopay for QR
    else if (method === 'ewallet') parameter.payment_type = 'gopay';
    else if (method === 'transfer') {
      parameter.payment_type = 'bank_transfer';
      parameter.bank_transfer = { bank: 'bca' };
    }

    const transaction = await snap.createTransaction(parameter);

    await pool.query('INSERT INTO payments (order_id, method, transaction_id, status, amount, payload) VALUES (?, ?, ?, ?, ?, ?)',
      [order_id, method, transaction.token, 'pending', order.grand_total, JSON.stringify(transaction)]);

    res.json({ token: transaction.token, redirect_url: transaction.redirect_url });
  } catch (err) {
    next(err);
  }
};

exports.paymentCallback = async (req, res, next) => {
  try {
    const notification = req.body;
    const orderNumber = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    let paymentStatus = 'pending';
    if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
      paymentStatus = 'paid';
    } else if (transactionStatus == 'deny' || transactionStatus == 'expire' || transactionStatus == 'cancel') {
      paymentStatus = 'failed';
    }

    const [orders] = await pool.query('SELECT id FROM orders WHERE order_number = ?', [orderNumber]);
    if (orders.length) {
      await pool.query('UPDATE orders SET payment_status = ? WHERE id = ?', [paymentStatus, orders[0].id]);
      await pool.query('UPDATE payments SET status = ? WHERE transaction_id = ?', [paymentStatus, notification.transaction_id]);
    }

    res.status(200).json({ status: 'OK' });
  } catch (err) {
    next(err);
  }
};