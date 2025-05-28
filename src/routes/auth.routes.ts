import express, { Router, RequestHandler } from 'express';
import { forgotPassword, login, resetPassword, signup, verifyEmail } from '../controllers/auth.controller';

const router: Router = express.Router();

router.post('/signup', signup);
router.get('/verify-email/:token', verifyEmail);
router.post('/signin', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;