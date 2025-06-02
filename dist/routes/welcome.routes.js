"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_controller_1 = require("../controllers/index.controller");
const router = express_1.default.Router();
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
router.get('/', index_controller_1.welcome);
exports.default = router;
//# sourceMappingURL=welcome.routes.js.map