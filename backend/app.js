import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import eventsRoutes from "./routes/events.js";
import authRoutes from "./routes/auth.js";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

/* CORS — keep this SIMPLE for now */
app.use(cors({
  origin: "https://events-management-frontend-l61hx5k41-codewithnadirys-projects.vercel.app"
}));

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));

/* 🔥 CONNECT DB BEFORE ROUTES */
await connectDB();

/* ROUTES */
app.use("/events", eventsRoutes);
app.use("/auth", authRoutes);

/* ERROR HANDLER */
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    message: error.message || "Server error",
  });
});

export default app;