import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const signJwt = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};
export const signRefreshJwt = (payload: object): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshJwt = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};
