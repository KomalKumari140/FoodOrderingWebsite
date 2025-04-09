import jwt from 'jsonwebtoken';
import { UNAUTHORIZED } from '../constants/httpStatus.js';

export default (req, res, next) => {
  const token = req.headers.access_token;
  if (!token) {
    return res.status(UNAUTHORIZED).json({ error: 'Access token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Call next() only if token verification succeeds
  } catch (error) {
    return res.status(UNAUTHORIZED).json({ error: 'Invalid access token' });
  }
};
