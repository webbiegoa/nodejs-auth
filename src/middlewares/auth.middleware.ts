import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import { JwtUser } from '../types/express';
import { StatusCodes } from 'http-status-codes';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access token missing' });
    return;
  }

  try {
    const decoded = verifyJwt(token) as JwtUser;    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid or expired token' });
    return; // <-- Optional but consistent
  }
};
