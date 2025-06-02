import multer from 'multer';
import { cvFileStorage, profileImageStorage, videoStorage } from '../config/cloudinary';
import { BadRequestError } from '../utils/errors';

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
    IMAGE: 5 * 1024 * 1024, // 5MB
    CV: 10 * 1024 * 1024,   // 10MB
    VIDEO: 50 * 1024 * 1024, // 50MB
  };

// Profile image upload
export const uploadProfileImage = multer({
    storage: profileImageStorage,
    limits: {
      fileSize: FILE_SIZE_LIMITS.IMAGE,
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestError('Only image files (JPEG, PNG, GIF, WebP) are allowed'));
      }
    },
  }).single('profileImage');


  // CV file upload
export const uploadCV = multer({
    storage: cvFileStorage,
    limits: {
      fileSize: FILE_SIZE_LIMITS.CV,
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestError('Only PDF, DOC, and DOCX files are allowed'));
      }
    },
  }).single('cvFile');

  // Video upload
export const uploadVideo = multer({
    storage: videoStorage,
    limits: {
      fileSize: FILE_SIZE_LIMITS.VIDEO,
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestError('Only MP4, AVI, MOV, and WMV video files are allowed'));
      }
    },
  }).single('introVideo');

  // Combined upload for multiple files
export const uploadUserFiles = multer({
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
      } else {
        cb(new BadRequestError(`File type ${file.mimetype} is not allowed`));
      }
    },
  }).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'cvFile', maxCount: 1 },
    { name: 'introVideo', maxCount: 1 }
  ]);