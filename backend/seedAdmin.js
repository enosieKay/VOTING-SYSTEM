import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected - seedAdmin.js:12");

    const email = "kayz1@gmail.com";

    // Delete old admin if exists
    await Admin.deleteOne({ email });
    console.log("⚠️ Old admin removed - seedAdmin.js:18");

    // Hash password
    const hashedPassword = await bcrypt.hash("14322", 10);

    // Create new admin
    const admin = new Admin({
      name: "ENOTECH",
      email,
      password: hashedPassword
    });

    await admin.save();
    console.log("✅ Admin created successfully - seedAdmin.js:31");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding admin: - seedAdmin.js:34", err.message);
    process.exit(1);
  }
};

seedAdmin();
