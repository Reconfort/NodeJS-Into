import { Request, RequestHandler, Response} from 'express';
import { UserService } from '../services/user.service';
import { generateJWT } from '../utils/jwt';

const userService = new UserService 

//Create users
export const signup = (async (req: Request, res: Response) => {
    try {
       const {name, email, password} = req.body;

       if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, Email and password are required' });
       }

       const newUser = await userService.create({ name, email, password});

       res.status(201).json(newUser);
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}) as RequestHandler;

//Login
export const login = ( async (req: Request, res: Response) => {
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

        const token = generateJWT(user);
        return res.json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email },
            token,
          });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}) as RequestHandler;

