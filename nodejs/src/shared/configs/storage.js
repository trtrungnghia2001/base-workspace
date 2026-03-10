import { v2 as CLOUDINARY } from 'cloudinary';
import multer from 'multer';
import ENV from './env.js';

CLOUDINARY.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

const storageMulter = multer.memoryStorage();

const uploadCloud = multer({
  storage: storageMulter,
  limits: { fileSize: 10 * 1024 * 1024 * 1024 }, // 10GB cho Multer
});

const StorageService = {
  // Upload lên Cloudinary
  async toCloudinary(fileBuffer, folder = 'general') {
    return new Promise((resolve, reject) => {
      const uploadStream = CLOUDINARY.uploader.upload_stream(
        { folder: `${ENV.CLOUDINARY_FOLDER}/${folder}`, resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(fileBuffer);
    });
  },
  async removeCloudinary(publicId) {
    try {
      if (!publicId) return;
      const result = await CLOUDINARY.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Lỗi khi xóa ảnh trên Cloudinary:', error);
      // Không nên throw error ở đây để tránh làm gián đoạn luồng chính của user
    }
  },

  // Upload lên ImgBB
  async toImgBB(fileBuffer) {
    // Logic gọi API ImgBB tại đây
  },
};

export { CLOUDINARY, uploadCloud, StorageService };
