import { Router } from "express";
import {
  createPlace,
  getPlaces,
  getPlaceBySlug,
  updatePlace,
  deletePlace,
} from "../controllers/places.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getPlaces);
router.get("/:slug", getPlaceBySlug);
router.post("/", requireAuth, createPlace);
router.put("/:id", requireAuth, updatePlace);
router.delete("/:id", requireAuth, deletePlace);

export default router;