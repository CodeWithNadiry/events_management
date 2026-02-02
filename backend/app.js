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
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://events-management-frontend-l61hx5k41-codewithnadirys-projects.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


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
mongoose.set("bufferCommands", false);

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ Mongo error:", err.message);
  });