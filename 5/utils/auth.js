import jwt from 'jsonwebtoken';

const JWT_SECRET = 'super_secret_key_for_iti_lab_2026_b8a';

export const createAuthenticationToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role || 'user' },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};