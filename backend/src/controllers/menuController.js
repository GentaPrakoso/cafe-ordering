const pool = require('../config/db');
const fs = require('fs');

exports.getAll = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = `
      SELECT m.*, c.name as category_name
      FROM menus m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (category) {
      query += ' AND m.category_id = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND m.name LIKE ?';
      params.push(`%${search}%`);
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM menus WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Menu not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, price, category_id, available } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const [result] = await pool.query(
      'INSERT INTO menus (name, description, price, image, category_id, available) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, image, category_id, available || true]
    );
    const [newMenu] = await pool.query('SELECT * FROM menus WHERE id = ?', [result.insertId]);
    res.status(201).json(newMenu[0]);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, available } = req.body;
    let image = null;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    const fields = [];
    const values = [];
    if (name) { fields.push('name = ?'); values.push(name); }
    if (description) { fields.push('description = ?'); values.push(description); }
    if (price) { fields.push('price = ?'); values.push(price); }
    if (category_id) { fields.push('category_id = ?'); values.push(category_id); }
    if (available !== undefined) { fields.push('available = ?'); values.push(available); }
    if (image) { fields.push('image = ?'); values.push(image); }
    values.push(id);
    await pool.query(`UPDATE menus SET ${fields.join(', ')} WHERE id = ?`, values);
    const [updated] = await pool.query('SELECT * FROM menus WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const [menu] = await pool.query('SELECT image FROM menus WHERE id = ?', [req.params.id]);
    if (menu.length > 0 && menu[0].image) {
      fs.unlink(`public${menu[0].image}`, () => {});
    }
    await pool.query('DELETE FROM menus WHERE id = ?', [req.params.id]);
    res.json({ message: 'Menu deleted' });
  } catch (err) {
    next(err);
  }
};