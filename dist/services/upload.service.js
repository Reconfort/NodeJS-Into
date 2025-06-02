"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadUserFiles = exports.uploadVideo = exports.uploadCV = exports.uploadProfileImage = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../config/cloudinary");
const errors_1 = require("../utils/errors");
// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
    IMAGE: 5 * 1024 * 1024, // 5MB
    CV: 10 * 1024 * 1024, // 10MB
    VIDEO: 50 * 1024 * 1024, // 50MB
};
// Profile image upload
exports.uploadProfileImage = (0, multer_1.default)({
    storage: cloudinary_1.profileImageStorage,
    limits: {
        fileSize: FILE_SIZE_LIMITS.IMAGE,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new errors_1.BadRequestError('Only image files (JPEG, PNG, GIF, WebP) are allowed'));
        }
    },
}).single('profileImage');
// CV file upload
exports.uploadCV = (0, multer_1.default)({
    storage: cloudinary_1.cvFileStorage,
    limits: {
        fileSize: FILE_SIZE_LIMITS.CV,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new errors_1.BadRequestError('Only PDF, DOC, and DOCX files are allowed'));
        }
    },
}).single('cvFile');
// Video upload
exports.uploadVideo = (0, multer_1.default)({
    storage: cloudinary_1.videoStorage,
    limits: {
        fileSize: FILE_SIZE_LIMITS.VIDEO,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new errors_1.BadRequestError('Only MP4, AVI, MOV, and WMV video files are allowed'));
        }
    },
}).single('introVideo');
// Combined upload for multiple files
exports.uploadUserFiles = (0, multer_1.default)({
    limits: {
        fileSize: FILE_SIZE_LIMITS.VIDEO, // Use the largest limit
    },
    fileFilter: (req, file, cb) => {
        const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const documentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const videoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
        const allAllowedTypes = [...imageTypes, ...documentTypes, ...videoTypes];
        if (allAllowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new errors_1.BadRequestError(`File type ${file.mimetype} is not allowed`));
        }
    },
}).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'cvFile', maxCount: 1 },
    { name: 'introVideo', maxCount: 1 }
]);
//# sourceMappingURL=upload.service.js.map