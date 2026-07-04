import { v2 as cloudinary } from 'cloudinary';

// Validate Cloudinary environment variables
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (!isCloudinaryConfigured) {
  console.warn('⚠️ WARNING: Cloudinary configuration incomplete');
  console.warn('Image upload features will not work');
  console.warn('Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Use HTTPS
  });
  console.log('✓ Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);
}

export default cloudinary;
export { isCloudinaryConfigured };
