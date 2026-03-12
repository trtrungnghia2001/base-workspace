import dotenv from 'dotenv';
dotenv.config({
  path: '.env',
  // path: process.env.NODE_ENV === 'production' ? '.env' : '.env.example',
});

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

  REDIS_URL: process.env.REDIS_URL,

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER,

  SESSION_SECRET: process.env.SESSION_SECRET,
  PASSPORT_URL_REDIRECT_SUCCESS: process.env.PASSPORT_URL_REDIRECT_SUCCESS,
  PASSPORT_URL_REDIRECT_FAILED: process.env.PASSPORT_URL_REDIRECT_FAILED,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

  IMGBB_API_KEY: process.env.IMGBB_API_KEY,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

export default ENV;
