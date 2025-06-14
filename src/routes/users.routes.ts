import express, { Router } from 'express';
import { 
  getAllUsers, 
  search, 
  getById, 
  updateUser, 
  deleteUser, 
  deleteFile,
  uploadFiles
} from '../controllers/users.controller';
import { authenticated } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validation.middleware';
import { 
  getUserByIdSchema, 
  updateUserSchema, 
  deleteUserSchema, 
  searchUsersSchema 
} from '../schema/user.schemas';
import { uploadUserFiles } from '../services/upload.service';

const router: Router = express.Router();

// Public routes
router.get('/search', validate(searchUsersSchema), search);

// Protected routes - require authentication
router.use(authenticated);

// Any authenticated user can view user details
router.get('/:id', validate(getUserByIdSchema), getById);


// Only admins can update or delete users

// File upload routes (users can manage their own files)
/**
 * @swagger
 * /users/upload:
 *   post:
 *     tags:
 *       - Users
 *     summary: Upload user files
 *     description: Upload profile image, CV, and/or intro video
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Profile image (JPEG, PNG, GIF, WebP - max 5MB)
 *               cvFile:
 *                 type: string
 *                 format: binary
 *                 description: CV file (PDF, DOC, DOCX - max 10MB)
 *               introVideo:
 *                 type: string
 *                 format: binary
 *                 description: Intro video (MP4, AVI, MOV, WMV - max 50MB)
 *     responses:
 *       200:
 *         description: Files uploaded successfully
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
 *                   example: "Files uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     uploadedFiles:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Bad request - invalid file type or size
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       413:
 *         description: File too large
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/upload', uploadUserFiles, uploadFiles);

/**
 * @swagger
 * /users/files/{fileType}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user file
 *     description: Delete a specific file (profileImage, cvFile, or introVideo)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [profileImage, cvFile, introVideo]
 *         description: Type of file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       400:
 *         description: Invalid file type
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: File not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/files/:fileType', deleteFile);

// Only admins can update or delete users
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a list of all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by name or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, user, moderator]
 *         description: Filter users by role
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                   example: "Users retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', authorize(['admin']), getAllUsers);

router.put('/:id', 
  authorize(['admin']), 
  validate(updateUserSchema), 
  updateUser
);

router.delete('/:id', 
  authorize(['admin']), 
  validate(deleteUserSchema), 
  deleteUser
);

export default router;