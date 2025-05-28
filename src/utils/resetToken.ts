import jwt from 'jsonwebtoken';

export const generateResetToken = (email: string): string => {
  return jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '15m' });
};