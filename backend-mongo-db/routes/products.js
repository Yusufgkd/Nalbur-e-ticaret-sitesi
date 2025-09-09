const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Tüm ürünleri listele
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Ürün ekle
router.post('/', async (req, res) => {
  const { name, price, description, stock } = req.body;
  const product = new Product({ name, price, description, stock });
  await product.save();
  res.status(201).json(product);
});

module.exports = router;
