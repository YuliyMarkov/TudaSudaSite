import { Router } from "express";
import {
  createHeroSlide,
  getHeroSlides,
  getHeroSlideById,
  updateHeroSlide,
  deleteHeroSlide,
} from "../controllers/hero-slides.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getHeroSlides);
router.get("/:id", getHeroSlideById);
router.post("/", requireAuth, createHeroSlide);
router.put("/:id", requireAuth, updateHeroSlide);
router.delete("/:id", requireAuth, deleteHeroSlide);

export default router;