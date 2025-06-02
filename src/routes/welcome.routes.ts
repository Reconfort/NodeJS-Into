import express, { Router } from 'express';
import { welcome } from '../controllers/index.controller';

const router: Router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Welcome
 *     summary: API Welcome Message
 *     description: Returns a welcome message and basic API information
 *     responses:
 *       200:
 *         description: Welcome message retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Welcome to Authentication API"
 *                 data:
 *                   type: object
 *                   properties:
 *                     version:
 *                       type: string
 *                       example: "1.0.0"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     endpoints:
 *                       type: object
 *                       properties:
 *                         documentation:
 *                           type: string
 *                           example: "/api-docs"
 *                         auth:
 *                           type: string
 *                           example: "/auth"
 *                         users:
 *                           type: string
 *                           example: "/users"
 */
router.get('/', welcome);

export default router;