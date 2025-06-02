import { Response, NextFunction } from 'express';
import { UserService } from '../services/users.service';
import { asyncHandler } from '../middleware/errorHandler';
import { 
  UpdateUserInput, 
  GetUserByIdInput, 
  SearchUsersInput, 
  DeleteUserInput 
} from '../schema/user.schemas';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors';
import { cloudinary } from '../config/cloudinary';


const userService = new UserService();

export const getAllUsers = asyncHandler(async (
  req: AuthenticatedRequest, 
  res: Response<ApiResponse>,
  next: NextFunction
) => {

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const users = await userService.findAll(page, limit);
  
  res.json({
    success: true,
    message: 'Users retrieved successfully',
    data: { users }
  });
});

export const search = asyncHandler(async (
  req: AuthenticatedRequest & SearchUsersInput, 
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { name } = req.query;
  
  const users = name ? await userService.findByName(name) : [];
  
  res.json({
    success: true,
    message: 'Search completed successfully',
    data: { users, count: users.length }
  });
});

export const getById = asyncHandler(async (
  req: AuthenticatedRequest & GetUserByIdInput, 
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { id } = req.params;
  
  const user = await userService.findById(id);
  if (!user) {
    throw new NotFoundError('User');
  }
  
  res.json({
    success: true,
    message: 'User retrieved successfully',
    data: { user }
  });
});

export const updateUser = asyncHandler(async (
  req: AuthenticatedRequest & UpdateUserInput, 
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if user exists
  const existingUser = await userService.findById(id);
  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  // Check email uniqueness if email is being updated
  if (updateData.email && updateData.email !== existingUser.email) {
    const userWithEmail = await userService.findByEmail(updateData.email);
    if (userWithEmail) {
      throw new ConflictError('Email is already in use');
    }
  }
  
  const updatedUser = await userService.update(id, updateData);
  
  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user: updatedUser }
  });
});

export const deleteUser = asyncHandler(async (
  req: AuthenticatedRequest & DeleteUserInput, 
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { id } = req.params;
  
  const user = await userService.findById(id);
  if (!user) {
    throw new NotFoundError('User');
  }
  
  const deleted = await userService.delete(id);
  if (!deleted) {
    throw new Error('Failed to delete user');
  }
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

export const uploadFiles = asyncHandler(async(
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  const user = await userService.findById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  const updateData: any = {};

  // Handle profile image
  if (files.profileImage && files.profileImage[0]) {
    // Delete old profile image if exists
    if (user.profileImage) {
      const publicId = user.profileImage.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`user-profiles/${publicId}`);
      }
    }
    updateData.profileImage = files.profileImage[0].path;
  }

  // Handle CV file
  if (files.cvFile && files.cvFile[0]) {
    // Delete old CV if exists
    if (user.cvFile) {
      const publicId = user.cvFile.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`user-cvs/${publicId}`, { resource_type: 'raw' });
      }
    }
    updateData.cvFile = files.cvFile[0].path;
  }

  // Handle intro video
  if (files.introVideo && files.introVideo[0]) {
    // Delete old video if exists
    if (user.introVideo) {
      const publicId = user.introVideo.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`user-videos/${publicId}`, { resource_type: 'video' });
      }
    }
    updateData.introVideo = files.introVideo[0].path;
  }

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('No files were uploaded');
  }

  const updatedUser = await userService.update(userId, updateData);

  res.json({
    success: true,
    message: 'Files uploaded successfully',
    data: { 
      user: updatedUser,
      uploadedFiles: Object.keys(updateData)
    }
  });
});

export const deleteFile = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { fileType } = req.params; // 'profileImage', 'cvFile', or 'introVideo'

  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  const user = await userService.findById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  let updateData: any = {};
  let publicId: string | undefined;
  let resourceType: 'image' | 'raw' | 'video' = 'image';

  switch (fileType) {
    case 'profileImage':
      if (user.profileImage) {
        publicId = user.profileImage.split('/').pop()?.split('.')[0];
        updateData.profileImage = null;
        resourceType = 'image';
      }
      break;
    case 'cvFile':
      if (user.cvFile) {
        publicId = user.cvFile.split('/').pop()?.split('.')[0];
        updateData.cvFile = null;
        resourceType = 'raw';
      }
      break;
    case 'introVideo':
      if (user.introVideo) {
        publicId = user.introVideo.split('/').pop()?.split('.')[0];
        updateData.introVideo = null;
        resourceType = 'video';
      }
      break;
    default:
      throw new BadRequestError('Invalid file type');
  }

  if (!publicId) {
    throw new NotFoundError('File not found');
  }

  // Delete from Cloudinary
  const folder = fileType === 'profileImage' ? 'user-profiles' : 
                 fileType === 'cvFile' ? 'user-cvs' : 'user-videos';
  
  await cloudinary.uploader.destroy(`${folder}/${publicId}`, { resource_type: resourceType });

  // Update user in database
  const updatedUser = await userService.update(userId, updateData);

  res.json({
    success: true,
    message: `${fileType} deleted successfully`,
    data: { user: updatedUser }
  });
});

