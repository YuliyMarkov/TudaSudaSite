import { Router } from "express";
import {
  createStory,
  getStories,
  getStoryBySlug,
  getStoryById,
  updateStory,
  deleteStory,
} from "../controllers/stories.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getStories);
router.get("/id/:id", requireAuth, getStoryById);
router.get("/:slug", getStoryBySlug);

router.post("/", requireAuth, createStory);
router.put("/:id", requireAuth, updateStory);
router.delete("/:id", requireAuth, deleteStory);

export default router;