const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';

// Generate a JWT token with a payload and expiry time
function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: '1h', // token expires in 1 hour
  });
}

// Verify and decode a JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
