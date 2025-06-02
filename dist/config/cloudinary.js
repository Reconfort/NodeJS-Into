"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.videoStorage = exports.cvFileStorage = exports.profileImageStorage = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Storage for profile images
exports.profileImageStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'user-profiles',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill' }],
    },
});
// Storage for CV files
exports.cvFileStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'user-cvs',
        allowed_formats: ['pdf', 'doc', 'docx'],
        resource_type: 'raw', // For non-image files
    },
});
// Storage for intro videos
exports.videoStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'user-videos',
        allowed_formats: ['mp4', 'avi', 'mov', 'wmv'],
        resource_type: 'video',
        transformation: [{ width: 640, height: 480, crop: 'limit' }],
    },
});
//# sourceMappingURL=cloudinary.js.map