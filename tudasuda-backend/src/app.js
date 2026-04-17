import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import restaurantsRoutes from "./routes/restaurants.routes.js";
import placesRoutes from "./routes/places.routes.js";
import moviesRoutes from "./routes/movies.routes.js";
import storiesRoutes from "./routes/stories.routes.js";
import heroSlidesRoutes from "./routes/hero-slides.routes.js";
import reelsRoutes from "./routes/reels.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "TudaSuda API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/restaurants", restaurantsRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/hero-slides", heroSlidesRoutes);
app.use("/api/reels", reelsRoutes);
app.use("/api/calendar", calendarRoutes);

export default app;