import { Request, RequestHandler, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { UserService } from '../services/user.service';
import { generateJWT, generateResetToken, generateVerifyToken } from '../utils/jwt';
import { sendResetPasswordEmail, sendVerificationEmail } from '../utils/email';

const userService = new UserService 

//Create users
export const signup = (async (req: Request, res: Response) => {
    try {
       const {name, email, password, role = 'user'} = req.body;

       if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, Email and password are required' });
       }

       const newUser = await userService.create({ name, email, password, role});
       const token = generateVerifyToken({ userId: newUser.id, email: newUser.email });
       const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

       await sendVerificationEmail(newUser.email, verifyLink);
       return res.status(201).json({newUser, message: 'User created. Check email to verify.' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}) as RequestHandler;

//Verify email
export const verifyEmail = (async (req:Request, res:Response) => {
    const { token } = req.params;
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
      const user = await userService.findById(payload.userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      if (user.isVerified) {
        res.status(400).json({ message: 'Already verified' });
        return;
      }
  
      await userService.update(user.id, { isVerified: true });
      res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
      res.status(400).json({ message: 'Invalid or expired token' });
    }
}) as RequestHandler;

//Login
export const login = (async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password required' });
        return;
    }

    try {
        const user = await userService.login(email, password);
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        if (!user.isVerified) {
            res.status(403).json({ message: 'Please verify your email before logging in.' });
            return;
        }

        const token = generateJWT(user);
        res.json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email },
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}) as RequestHandler;


//forgot Password
export const forgotPassword = (async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'No user found with that email' });
        }

        const token = generateResetToken(user.email);
        const resetLink = `${process.env.RESET_PASSWORD_URL}/${token}`;

        await sendResetPasswordEmail(email, resetLink);

        res.status(200).json({ message: 'Reset password link sent to email' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}) as RequestHandler

// Reset Password
export const resetPassword = (async (req: Request, res: Response) => {
    const { token } = req.params;

    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: 'New password is required' });
    }

    try {
        // 1. Verify token and extract email
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
        const user = await userService.findByEmail(decoded.email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

        // 2. Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Update the user's password
        const updatedUser = await userService.update(user.id, { password: hashedPassword });

        res.status(200).json({ message: 'Password has been reset successfully' });



    } catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({ message: 'Invalid or expired token' })
    };
}) as RequestHandler

