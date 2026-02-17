import jwt from 'jsonwebtoken';
import Product from '../models/Product.model.js';
const JWT_SECRET = 'super_secret_key_for_iti_lab_2026_b8a';

// is the user logged in?
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // get token
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // adds {id, role} to the request object
    next();
  } catch {
    res.status(401).json({ message: "Token failed" });
  }
};

// product Ownership
export const checkProductOwnership = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // admin || user is the owner
  if (req.user.role === 'admin' || product.owner.toString() === req.user.id) {
    return next();
  }
  res.status(403).json({ message: "Forbidden: You don't own this product" });
};

// user Self-Access
export const checkSelf = (req, res, next) => {
  if (req.user.role === 'admin' || req.params.id === req.user.id) {
    return next();
  }
  res.status(403).json({ message: "Forbidden: You can only manage your own profile" });
};