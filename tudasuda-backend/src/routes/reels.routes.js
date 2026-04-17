import { Router } from "express";
import {
  createReel,
  getReels,
  getReelById,
  updateReel,
  deleteReel,
} from "../controllers/reels.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getReels);
router.get("/:id", getReelById);
router.post("/", requireAuth, createReel);
router.put("/:id", requireAuth, updateReel);
router.delete("/:id", requireAuth, deleteReel);

export default router;