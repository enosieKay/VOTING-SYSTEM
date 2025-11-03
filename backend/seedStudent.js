import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Student from "./models/Student.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const seedStudent = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected - seedStudent.js:12");

    const email = "student1@gmail.com";

    await Student.deleteOne({ email });
    console.log("⚠️ Old student removed - seedStudent.js:17");

    const hashedPassword = await bcrypt.hash("12345", 10);

    const student = new Student({
      name: "STUDENT ONE",
      email,
      password: hashedPassword
    });

    await student.save();
    console.log("✅ Student created successfully - seedStudent.js:28");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding student: - seedStudent.js:31", err.message);
    process.exit(1);
  }
};

seedStudent();
