import { Router } from "express";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantBySlug,
  updateRestaurant,
  deleteRestaurant,
  rateRestaurant,
} from "../controllers/restaurants.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getRestaurants);
router.get("/:slug", getRestaurantBySlug);
router.post("/", requireAuth, createRestaurant);
router.put("/:id", requireAuth, updateRestaurant);
router.delete("/:id", requireAuth, deleteRestaurant);
router.post("/:id/rate", rateRestaurant);

export default router;