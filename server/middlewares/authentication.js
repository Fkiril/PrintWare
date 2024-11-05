import { webAuth } from '../services/firebase.js';

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;  

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await webAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

export default authenticate;
