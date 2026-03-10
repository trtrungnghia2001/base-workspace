import mongoose from 'mongoose';
import dns from 'node:dns/promises';
import ENV from './env.js';

if (!ENV.IS_PRODUCTION) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI, {
      dbName: ENV.MONGO_DB,
    });
    console.log('MongoDB Cloud: Connected!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
