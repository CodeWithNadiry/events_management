import { validationResult } from "express-validator";
import Event from "../models/Event.js";
import deleteFile from "../util/file.js";

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.status(200).json({
      events,
      message: "Events fetched successfully",
    });
  } catch (error) {
    console.error(error); // <-- log actual error to see in terminal
    error.statusCode ||= 500;
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId);

    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      event,
      message: "event fetched successfully",
    });
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
      const error = new Error("No image provided");
      error.statusCode = 422;
      throw error;
    }

    const { title, description, date } = req.body;

    const event = new Event({
      title,
      description,
      date,
      image: `/images/${req.file.filename}`, // ✅ FIX
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
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
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

    let { title, description, date } = req.body;

    if (req.file) {
      deleteFile(event.image);
      event.image = `/images/${req.file.filename}`; // ✅ FIX
    }

    event.title = title;
    event.description = description;
    event.date = date;

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
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    deleteFile(event.image);
    await Event.findByIdAndDelete(eventId);

    res.status(200).json({
      message: "Event deleted successfully!",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};
