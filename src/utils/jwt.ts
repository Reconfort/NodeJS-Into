import jwt from 'jsonwebtoken';
import { User } from '../modals/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 

export function generateJWT(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  }