import crypto from 'crypto';
export const generateToken = () => crypto.randomBytes(32).toString('hex');

export const generateExpiry = (hours = 2) => new Date(Date.now() + hours * 60 * 60 * 1000);
