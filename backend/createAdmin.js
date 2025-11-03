import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected - createAdmin.js:9"))
  .catch(err => console.log(err));

const createAdmin = async () => {
  const email = "admin@example.com";      // your admin email
  const password = "admin123";            // your admin password
  const name = "Admin";

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new Admin({
    name,
    email,
    password: hashedPassword
  });

  await admin.save();
  console.log("✅ Admin created successfully - createAdmin.js:26");
  mongoose.disconnect();
};

createAdmin();
