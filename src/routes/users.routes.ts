import express, { Router, RequestHandler } from 'express';
import { getAllUsers, search, getById, updateUser, deleteUser } from '../controllers/users.controller';
import { authenticated } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize';

const router: Router = express.Router();

// public routes
router.get('/', getAllUsers);
router.get('/search', search);

//Protect everything below 
router.use(authenticated);

// any authenticated user
router.get('/:id', getById);

// only admins can update or delete
router.put('/:id', authorize(['admin']), updateUser);
router.delete('/:id', authorize(['admin']),deleteUser);

export default router;