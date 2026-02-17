import express from 'express';
import User from '../models/User.model.js';
import { userJoiSchema } from '../models/User.validator.js';
import { validate } from '../middleware/validation.js';
import { createAuthenticationToken } from '../utils/auth.js';
import { protect, checkSelf } from '../middleware/auth.middleware.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Public: Register
router.post('/', validate(userJoiSchema), async (req, res) => {
  try {
    const { username, password, firstName, lastName, dob } = req.body;
    
    // This ignores 'role' even if the user sends it in Postman and fallback to definition in schema
    const newUser = await User.create({
      username, password, firstName, lastName, dob
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: "Registration failed", error: err.message });
  }
});

// Public: Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = createAuthenticationToken(user);
    res.json({ token, user: { username: user.username, role: user.role } });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Protected: Get all (Admin only)
router.get('/', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Admin access required" });
  const users = await User.find().select('firstName lastName role');
  res.json(users);
});

// Protected: Get/Edit/Delete (Self or Admin)
router.get('/:id', protect, checkSelf, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

router.patch('/:id', protect, checkSelf, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    Object.assign(user, req.body);
    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;