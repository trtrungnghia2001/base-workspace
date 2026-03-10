import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const ENV = {
  PORT: process.env.PORT,
  SOCKET_PORT: process.env.SOCKET_PORT,
  WEBSITE_URL: process.env.WEBSITE_URL,

  MONGO_URI: process.env.MONGO_URI,
  MONGO_DB: process.env.MONGO_DB,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRESIN: process.env.JWT_EXPIRESIN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRESIN: process.env.JWT_REFRESH_EXPIRESIN,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_USERNAME: process.env.REDIS_USERNAME,

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER,

  IMGBB_API_KEY: process.env.IMGBB_API_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

export default ENV;
