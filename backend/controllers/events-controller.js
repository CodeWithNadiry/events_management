import { validationResult } from "express-validator";
import Event from "../models/Event.js";
import cloudinary from "../util/cloudinary.js";

/* ======================
   HELPERS
====================== */
const getPublicIdFromUrl = (url) => {
  return url.split("/").pop().split(".")[0];
};

/* ======================
   CONTROLLERS
====================== */
export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ events });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ event });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      throw error;
    }

    if (!req.file) {
      const error = new Error("Image is required");
      error.statusCode = 422;
      throw error;
    }

    const { title, description, date } = req.body;

    const event = new Event({
      title,
      description,
      date,
      image: req.file.path, // ✅ Cloudinary URL
    });

    await event.save();

    res.status(201).json({
      event,
      message: "Event created successfully",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      throw error;
    }

    const { title, description, date } = req.body;

    if (req.file) {
      // 🔥 delete old image from Cloudinary
      const publicId = getPublicIdFromUrl(event.image);
      await cloudinary.uploader.destroy(`events/${publicId}`);

      event.image = req.file.path; // ✅ new Cloudinary URL
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;

    await event.save();

    res.status(200).json({
      event,
      message: "Event updated successfully",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    // 🔥 delete image from Cloudinary
    const publicId = getPublicIdFromUrl(event.image);
    await cloudinary.uploader.destroy(`events/${publicId}`);

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};