import express from "express";
import path from "path";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import eventsRoutes from "./routes/events.js";
import authRoutes from './routes/auth.js'
dotenv.config();

const app = express();
const __dirname = path.resolve(); // Required in ES Modules to get current folder

const MONGO_URI = process.env.MONGO_URI;

// Multer storage setup
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public", "images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter
const allowedTypes = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
const fileFilter = (req, file, cb) => {
  cb(null, allowedTypes.includes(file.mimetype));
};

// Middlewares
app.options("*", cors());
app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use(
  cors({
    origin: [
      "https://events-management-bqc7.vercel.app", // frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
// Routes
app.use("/events", eventsRoutes);
app.use('/auth', authRoutes)

// Error handling
app.use((error, req, res, next) => {
  const {
    statusCode: status = 500,
    message = "Something went wrong",
    data = null,
  } = error;
  res.status(status).json({ message, data });
});

// MongoDB connection
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
