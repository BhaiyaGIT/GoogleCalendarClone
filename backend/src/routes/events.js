const express = require("express");
const eventController = require("../controllers/eventController");

const router = express.Router();

// Event routes
router.get("/", eventController.getEvents);
router.get("/search", eventController.searchEvents);
router.get("/:id", eventController.getEvent);
router.post("/", eventController.createEvent);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

module.exports = router;
