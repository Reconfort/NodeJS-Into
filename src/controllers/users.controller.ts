import express, { Request, Response, NextFunction, Router, RequestHandler } from 'express';
import { UserService } from '../services/user.service';
import { User } from '../modals/User';

const router: Router = express.Router();
const userService = new UserService();

// GET all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// GET users by search query
export const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.query.name as string;
    if (name) {
      const users = await userService.findByName(name);
      res.json(users);
      return;
    }
    const allUsers = await userService.findAll();
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
};

// GET user by ID
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await userService.findById(userId);
    
    if (!user) {
      const err: Error & { status?: number } = new Error('User not found');
      err.status = 404;
      next(err);
      return;
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// PUT update user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const userData: Partial<User> = req.body;
    
    const updatedUser = await userService.update(userId, userData);
    if (!updatedUser) {
      const err: Error & { status?: number } = new Error('User not found');
      err.status = 404;
      next(err);
      return;
    }
    
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// DELETE user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const deleted = await userService.delete(userId);
    
    if (!deleted) {
      const err: Error & { status?: number } = new Error('User not found');
      err.status = 404;
      next(err);
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default router;