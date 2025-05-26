import express, { Router, RequestHandler } from 'express';
import { getAllUsers, search, getById, updateUser, deleteUser } from '../controllers/users.controller';

const router: Router = express.Router();

router.get('/', getAllUsers);
router.get('/search', search);
router.get('/:id', getById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;