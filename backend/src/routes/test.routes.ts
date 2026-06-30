import { Router, Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';

const router = Router();

// Test Cloudinary credentials
router.get('/test-cloudinary', async (req: Request, res: Response) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary credentials not set in .env'
      });
    }

    // Try to ping Cloudinary API
    const result = await cloudinary.api.ping();
    
    res.json({
      success: true,
      message: 'Cloudinary connection successful',
      data: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        status: result.status
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Cloudinary connection failed',
      error: error.message,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME
    });
  }
});

// Simple multer config for test endpoint only
const storage = multer.memoryStorage();
const testUpload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/test-upload', testUpload.any(), async (req: Request, res: Response) => {
  try {
    // Check if Cloudinary credentials are set
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary credentials not configured in .env'
      });
    }

    // Get the first file regardless of field name
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided. Upload any image in form-data.'
      });
    }

    const file = files[0];
    console.log('File received:', file.originalname, file.size, 'bytes');

    // Upload to Cloudinary
    const uploadStream = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'test',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        secure_url: uploadStream.secure_url,
        public_id: uploadStream.public_id
      }
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image to Cloudinary',
      error: error.message
    });
  }
});

export default router;
