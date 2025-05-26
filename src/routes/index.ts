import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Home Page');
});

router.get('/status', (req: Request, res: Response) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

export default router;