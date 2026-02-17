import express from 'express';
import Product from '../models/Product.model.js';
import { productJoiSchema } from '../models/Product.validator.js';
import { validate } from '../middleware/validation.js';
import { protect, checkProductOwnership } from '../middleware/auth.middleware.js';

const router = express.Router();

// Anyone logged in can create a product
router.post('/', protect, validate(productJoiSchema), async (req, res) => {
  try {
    // Force the owner ID to be the logged in user unless they are admin
    const productData = { ...req.body, owner: req.user.id };
    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Anyone logged in can search products
router.get('/', protect, async (req, res) => {
  let { limit = 10, skip = 0, status } = req.query;
  let filter = {};
  if (status === 'available') filter.quantity = { $gt: 2 };
  else if (status === 'low stock') filter.quantity = { $gt: 0, $lte: 2 };

  const products = await Product.find(filter).limit(Number(limit)).skip(Number(skip));
  res.json(products);
});

// only owner || Admin can update/stock/delete
router.patch('/:id', protect, checkProductOwnership, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

router.patch('/:id/stock', protect, checkProductOwnership, async (req, res) => {
  const { operation, quantity } = req.body;
  const product = await Product.findById(req.params.id);
  
  if (operation === 'destock' && product.quantity < quantity) {
    return res.status(400).json({ message: "Insufficient stock" });
  }

  product.quantity += (operation === 'destock' ? -quantity : quantity);
  await product.save();
  res.json(product);
});

router.delete('/:id', protect, checkProductOwnership, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

export default router;