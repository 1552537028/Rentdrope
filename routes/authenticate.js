// middleware/authenticate.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();  // Pass to the next middleware or route handler
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
