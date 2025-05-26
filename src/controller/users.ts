import express, { Request, Response, NextFunction, Router, RequestHandler } from 'express';
import { UserService } from '../services/user.service';
import { User } from '../entities/User';

const router: Router = express.Router();
const userService = new UserService();

// GET all users
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /users/search
// GET users by search query
router.get('/search', (async(req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.query.name as string;
    if (name) {
      const users = await userService.findByName(name);
      return res.json(users);
    }
    const allUsers = await userService.findAll();
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

// GET user by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await userService.findById(userId);
    
    if (!user) {
      const err: Error & { status?: number } = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST create new user
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: Partial<User> = req.body;
    const newUser = await userService.create(userData);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// PUT update user
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const userData: Partial<User> = req.body;
    
    const updatedUser = await userService.update(userId, userData);
    if (!updatedUser) {
      const err: Error & { status?: number } = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// DELETE user
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const deleted = await userService.delete(userId);
    
    if (!deleted) {
      const err: Error & { status?: number } = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;