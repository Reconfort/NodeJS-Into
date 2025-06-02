"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadFiles = exports.deleteUser = exports.updateUser = exports.getById = exports.search = exports.getAllUsers = void 0;
const users_service_1 = require("../services/users.service");
const errorHandler_1 = require("../middleware/errorHandler");
const errors_1 = require("../utils/errors");
const cloudinary_1 = require("../config/cloudinary");
const userService = new users_service_1.UserService();
exports.getAllUsers = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const users = await userService.findAll(page, limit);
    res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: { users }
    });
});
exports.search = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { name } = req.query;
    const users = name ? await userService.findByName(name) : [];
    res.json({
        success: true,
        message: 'Search completed successfully',
        data: { users, count: users.length }
    });
});
exports.getById = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { id } = req.params;
    const user = await userService.findById(id);
    if (!user) {
        throw new errors_1.NotFoundError('User');
    }
    res.json({
        success: true,
        message: 'User retrieved successfully',
        data: { user }
    });
});
exports.updateUser = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;
    // Check if user exists
    const existingUser = await userService.findById(id);
    if (!existingUser) {
        throw new errors_1.NotFoundError('User not found');
    }
    // Check email uniqueness if email is being updated
    if (updateData.email && updateData.email !== existingUser.email) {
        const userWithEmail = await userService.findByEmail(updateData.email);
        if (userWithEmail) {
            throw new errors_1.ConflictError('Email is already in use');
        }
    }
    const updatedUser = await userService.update(id, updateData);
    res.json({
        success: true,
        message: 'User updated successfully',
        data: { user: updatedUser }
    });
});
exports.deleteUser = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { id } = req.params;
    const user = await userService.findById(id);
    if (!user) {
        throw new errors_1.NotFoundError('User');
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
exports.uploadFiles = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const userId = req.user?.id;
    const files = req.files;
    if (!userId) {
        throw new errors_1.BadRequestError('User ID is required');
    }
    const user = await userService.findById(userId);
    if (!user) {
        throw new errors_1.NotFoundError('User');
    }
    const updateData = {};
    // Handle profile image
    if (files.profileImage && files.profileImage[0]) {
        // Delete old profile image if exists
        if (user.profileImage) {
            const publicId = user.profileImage.split('/').pop()?.split('.')[0];
            if (publicId) {
                await cloudinary_1.cloudinary.uploader.destroy(`user-profiles/${publicId}`);
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
                await cloudinary_1.cloudinary.uploader.destroy(`user-cvs/${publicId}`, { resource_type: 'raw' });
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
                await cloudinary_1.cloudinary.uploader.destroy(`user-videos/${publicId}`, { resource_type: 'video' });
            }
        }
        updateData.introVideo = files.introVideo[0].path;
    }
    if (Object.keys(updateData).length === 0) {
        throw new errors_1.BadRequestError('No files were uploaded');
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
exports.deleteFile = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const userId = req.user?.id;
    const { fileType } = req.params; // 'profileImage', 'cvFile', or 'introVideo'
    if (!userId) {
        throw new errors_1.BadRequestError('User ID is required');
    }
    const user = await userService.findById(userId);
    if (!user) {
        throw new errors_1.NotFoundError('User');
    }
    let updateData = {};
    let publicId;
    let resourceType = 'image';
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
            throw new errors_1.BadRequestError('Invalid file type');
    }
    if (!publicId) {
        throw new errors_1.NotFoundError('File not found');
    }
    // Delete from Cloudinary
    const folder = fileType === 'profileImage' ? 'user-profiles' :
        fileType === 'cvFile' ? 'user-cvs' : 'user-videos';
    await cloudinary_1.cloudinary.uploader.destroy(`${folder}/${publicId}`, { resource_type: resourceType });
    // Update user in database
    const updatedUser = await userService.update(userId, updateData);
    res.json({
        success: true,
        message: `${fileType} deleted successfully`,
        data: { user: updatedUser }
    });
});
//# sourceMappingURL=users.controller.js.map