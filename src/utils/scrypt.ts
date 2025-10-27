import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export const hashPassword = async (password: string): Promise<{ hash: string; salt: string }> => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return { hash: derivedKey.toString('hex'), salt };
};

export const verifyPassword = async (password: string, hash: string, salt: string): Promise<boolean> => {
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return derivedKey.toString('hex') === hash;
};