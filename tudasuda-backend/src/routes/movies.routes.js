import { Router } from "express";
import {
  createMovie,
  getMovies,
  getMovieBySlug,
  updateMovie,
  deleteMovie,
  rateMovie,
} from "../controllers/movies.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getMovies);
router.get("/:slug", getMovieBySlug);
router.post("/", requireAuth, createMovie);
router.put("/:id", requireAuth, updateMovie);
router.delete("/:id", requireAuth, deleteMovie);
router.post("/:id/rate", rateMovie);

export default router;