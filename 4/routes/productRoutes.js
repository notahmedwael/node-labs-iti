import express from 'express';
import Product from '../models/Product.model.js';
import { productJoiSchema } from '../models/Product.validator.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Create Product
router.post('/', validate(productJoiSchema), async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Products
router.get('/', async (req, res) => {
  try {
    let { limit = 10, skip = 0, status } = req.query;
    let filter = {};
    if (status === 'available') filter.quantity = { $gt: 2 };
    else if (status === 'low stock') filter.quantity = { $gt: 0, $lte: 2 };
    else if (status === 'out of stock') filter.quantity = 0;

    const products = await Product.find(filter).limit(parseInt(limit)).skip(parseInt(skip));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Products of specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const products = await Product.find({ owner: req.params.userId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit Product
router.patch('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Stock Logic
router.patch('/:id/stock', async (req, res) => {
  const { operation, quantity } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (operation === 'destock' && product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock", currentStock: product.quantity });
    }

    const change = operation === 'destock' ? -quantity : quantity;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { quantity: change } },
      { new: true, runValidators: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;