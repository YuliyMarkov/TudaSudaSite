import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import restaurantsRoutes from "./routes/restaurants.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "TudaSuda API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/restaurants", restaurantsRoutes);

export default app;