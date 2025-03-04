import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
console.log("MONGO_URI:", process.env.MONGO_URI);


if (!MONGO_URI) {
  console.error('MongoDB URI is not defined in environment variables.');
  process.exit(1);
}

const connectDB = async () => {

    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(' Connected to MongoDB'))
    .catch(err => console.error(' MongoDB connection error:', err));
  
};

export default connectDB;
