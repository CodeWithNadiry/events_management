import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../util/cloudinary.js";
import { body } from "express-validator";

import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  updateEvent,
} from "../controllers/events-controller.js";

const router = express.Router();

/* ======================
   CLOUDINARY + MULTER
====================== */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "events",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
  },
});

const upload = multer({ storage });

/* ======================
   ROUTES
====================== */
router.get("/", getAllEvents);
router.get("/:id", getEvent);

router.post(
  "/",
  upload.single("image"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters"),
    body("date")
      .notEmpty()
      .isISO8601()
      .withMessage("Date must be valid"),
  ],
  createEvent
);

router.patch(
  "/:id",
  upload.single("image"),
  [
    body("title").optional().trim().notEmpty(),
    body("description").optional().trim().isLength({ min: 10 }),
    body("date").optional().isISO8601(),
  ],
  updateEvent
);

router.delete("/:id", deleteEvent);

export default router;