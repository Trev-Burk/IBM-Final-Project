// authMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware to verify JWT and authenticate users
function authenticateToken(req, res, next) {
  // Retrieve the token from the request headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach the user information to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
}

// Middleware to authorize users based on roles
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next(); // User has the required role, proceed to the next middleware or route handler
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles,
};