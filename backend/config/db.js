// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected - db.js:10");
  } catch (err) {
    console.error("MongoDB connection error: - db.js:12", err);
    process.exit(1);
  }
};

export default connectDB;
