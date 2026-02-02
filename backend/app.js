import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import eventsRoutes from "./routes/events.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

/* CORS */
app.use(cors({ origin: "*" }));

/* middleware */
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public", "images")));

/* routes */
app.use("/events", eventsRoutes);
app.use("/auth", authRoutes);

/* error handler */
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    message: error.message || "Server error",
  });
});

/* MongoDB (NO app.listen) */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error:", err));

export default app;