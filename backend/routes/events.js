import express from "express";
import multer from "multer";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  updateEvent,
} from "../controllers/events-controller.js";
import { body } from "express-validator";

const router = express.Router();

/* ======================
   MULTER SETUP
====================== */
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

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

const upload = multer({ storage: fileStorage, fileFilter });

/* ======================
   ROUTES
====================== */
router.get("/", getAllEvents);
router.get("/:id", getEvent);

// CREATE EVENT (POST)
router.post(
  "/",
  upload.single("image"), // 🔥 IMPORTANT
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long"),
    body("date")
      .notEmpty()
      .withMessage("Date is required")
      .isISO8601()
      .withMessage("Date must be a valid date"),
  ],
  createEvent
);

// UPDATE EVENT (PATCH — matches frontend)
router.patch(
  "/:id",
  upload.single("image"), // 🔥 IMPORTANT
  [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),
    body("description")
      .optional()
      .trim()
      .isLength({ min: 20 })
      .withMessage("Description must be at least 20 characters long"),
    body("date")
      .optional()
      .isISO8601()
      .withMessage("Date must be a valid date"),
  ],
  updateEvent
);

router.delete("/:id", deleteEvent);

export default router;