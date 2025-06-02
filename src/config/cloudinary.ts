import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for profile images
export const profileImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'user-profiles',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 400, height: 400, crop: 'fill' }],
    } as any,
  });

// Storage for CV files
export const cvFileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'user-cvs',
      allowed_formats: ['pdf', 'doc', 'docx'],
      resource_type: 'raw', // For non-image files
    } as any,
  });

  // Storage for intro videos
export const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'user-videos',
      allowed_formats: ['mp4', 'avi', 'mov', 'wmv'],
      resource_type: 'video',
      transformation: [{ width: 640, height: 480, crop: 'limit' }],
    } as any,
  });

export { cloudinary };