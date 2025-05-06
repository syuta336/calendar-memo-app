import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';

// 環境変数を読み込む
dotenv.config();

const mongoURI = process.env.MONGO_URI as string;

if (!mongoURI) {
  throw new Error('MONGO_URI is not defined in .env file');
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1); // エラーが発生した場合はプロセスを終了
  }
};

async function getEvents() {
  try {
    const events = await Event.find().sort({ updatedAt: -1 });
    console.log(JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error fetching events: ', error);
  }
}

getEvents();

export default connectDB;
