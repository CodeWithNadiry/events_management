import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  updateEvent,
} from "../controllers/events-controller.js";
import { body } from "express-validator";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEvent);

// Validation for creating an event
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 20 characters long"),
    body("date")
      .notEmpty()
      .withMessage("Date is required")
      .isISO8601()
      .withMessage("Date must be a valid date"), // validates date format
  ],
  createEvent,
);

router.put(
  "/:id",
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
  updateEvent,
);
router.delete("/:id", deleteEvent);

export default router;
