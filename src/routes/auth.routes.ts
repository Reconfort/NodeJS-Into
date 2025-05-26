import express, { Router, RequestHandler } from 'express';
import { login, signup } from '../controllers/auth.controller';

const router: Router = express.Router();

router.post('/signup', signup);
router.post('/signin', login);

export default router;