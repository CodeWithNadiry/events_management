import express from "express";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import eventsRoutes from "./routes/events.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const MONGO_URI = process.env.MONGO_URI;

/* ======================
   CORS (MUST BE FIRST)
====================== */
app.use(
  cors({
    origin: "https://events-management-bqc7.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight
app.options("*", cors());

/* ======================
   BASIC MIDDLEWARE
====================== */
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public", "images")));

/* ======================
   ROUTES
====================== */
app.use("/events", eventsRoutes);
app.use("/auth", authRoutes);

/* ======================
   ERROR HANDLER
====================== */
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  const data = error.data || null;
  res.status(status).json({ message, data });
});

/* ======================
   DATABASE
====================== */
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));