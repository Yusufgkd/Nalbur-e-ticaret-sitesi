const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Sipariş oluştur
router.post('/', async (req, res) => {
  const { user, products, total } = req.body;
  const order = new Order({ user, products, total });
  await order.save();
  res.status(201).json(order);
});

// Tüm siparişleri listele
router.get('/', async (req, res) => {
  const orders = await Order.find().populate('user').populate('products.product');
  res.json(orders);
});

module.exports = router;
