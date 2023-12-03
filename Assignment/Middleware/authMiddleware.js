const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const secretKey ='defaultSecretKeyqwertyuiopasdfghjkl';

const authenticateUser = async (req, res, next) => {
  try {
    // Extract token from headers
    //console.log(req.headers);
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication failed. No token provided.' });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, secretKey);

    // Find the user by the decoded token's ID
    const user = await User.findById(decodedToken.userId);

    // Attach the user object to the request for further use
    req.user = user;

    // Continue to the next middleware or route
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed. Invalid token.123456' });
  }
};

module.exports = authenticateUser;
