const pool = require('../config/db');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vouchers');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { code, discount_percent, discount_nominal, valid_from, valid_until, max_usage } = req.body;
    const [result] = await pool.query(
      'INSERT INTO vouchers (code, discount_percent, discount_nominal, valid_from, valid_until, max_usage) VALUES (?, ?, ?, ?, ?, ?)',
      [code, discount_percent, discount_nominal, valid_from, valid_until, max_usage]
    );
    const [voucher] = await pool.query('SELECT * FROM vouchers WHERE id = ?', [result.insertId]);
    res.status(201).json(voucher[0]);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discount_percent, discount_nominal, valid_from, valid_until, max_usage } = req.body;
    await pool.query(
      'UPDATE vouchers SET code = ?, discount_percent = ?, discount_nominal = ?, valid_from = ?, valid_until = ?, max_usage = ? WHERE id = ?',
      [code, discount_percent, discount_nominal, valid_from, valid_until, max_usage, id]
    );
    const [voucher] = await pool.query('SELECT * FROM vouchers WHERE id = ?', [id]);
    res.json(voucher[0]);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM vouchers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Voucher deleted' });
  } catch (err) {
    next(err);
  }
};

exports.validate = async (req, res, next) => {
  try {
    const { code } = req.body;
    const [vouch] = await pool.query('SELECT * FROM vouchers WHERE code = ? AND valid_from <= NOW() AND valid_until >= NOW()', [code]);
    if (!vouch.length) return res.status(404).json({ message: 'Invalid or expired voucher' });
    if (vouch[0].max_usage && vouch[0].used_count >= vouch[0].max_usage) {
      return res.status(400).json({ message: 'Voucher usage limit reached' });
    }
    res.json(vouch[0]);
  } catch (err) {
    next(err);
  }
};