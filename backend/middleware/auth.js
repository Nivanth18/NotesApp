const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// This function runs before every protected route.
// req → the incoming request
// res → the outgoing response  
// next → call this to proceed to the actual route handler
const authMiddleware = async (req, res, next) => {
  try {
    // Frontend sends the token in the Authorization header:
    // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Extract the token part after "Bearer "
    const token = authHeader.split(' ')[1];

    // Verify the token using our secret key.
    // This throws an error if the token is invalid or expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request so route handlers can access it
    // We use .select('-password') to exclude the password field
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // now available as req.user in all routes
    next();           // proceed to the route handler
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;