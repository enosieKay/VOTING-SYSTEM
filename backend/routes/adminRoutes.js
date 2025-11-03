import express from "express";
import { loginAdmin } from "../controllers/authController.js";
import { 
  addCandidate, 
  getCandidatesAdmin, 
  deleteCandidate, 
  updateCandidate // ✅ import update function
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Only admin access
router.post("/candidates", verifyToken, addCandidate);
router.get("/candidates", verifyToken, getCandidatesAdmin);
router.put("/candidates/:id", verifyToken, updateCandidate); // ✅ update route
router.delete("/candidates/:id", verifyToken, deleteCandidate);
router.post("/login", loginAdmin);
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: "Welcome, Admin!", user: req.user });
});

export default router;
