import { Router } from "express";
import { getCalendarItems } from "../controllers/calendar.controller.js";

const router = Router();

router.get("/", getCalendarItems);

export default router;