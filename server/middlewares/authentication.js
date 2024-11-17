import { adminAuth } from '../services/FirebaseAdminSDK.js';

const authenticate = async (req, res, next) => {
  // console.log('request headers: ', req.headers);
  // console.log('request query: ', req.query);
  const token = req.headers.authorization;  

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token.split('Bearer ')[1]);
    // const decodedToken = await webAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

export default authenticate;
