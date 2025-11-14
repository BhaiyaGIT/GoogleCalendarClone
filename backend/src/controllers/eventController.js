const { v4: uuidv4 } = require('uuid');
const Event = require('../models/Event');
const { getEventsByDateRange, formatEventResponse, generateRecurringInstances, checkEventConflict } = require('../utils/eventUtils');

// Get events for a date range
exports.getEvents = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate are required',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format',
      });
    }

    const events = await getEventsByDateRange(Event, start, end);

    // Expand recurring events
    let expandedEvents = [];
    for (const event of events) {
      if (event.recurrence.type !== 'none') {
        const instances = generateRecurringInstances(event, start, end);
        expandedEvents.push(...instances);
      } else {
        expandedEvents.push(event);
      }
    }

    res.json({
      success: true,
      data: expandedEvents.map(formatEventResponse),
    });
  } catch (error) {
    next(error);
  }
};

// Get single event
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findOne({ id: req.params.id });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      data: formatEventResponse(event),
    });
  } catch (error) {
    next(error);
  }
};

// Create event
exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, startTime, endTime, allDay, color, location, recurrence, attendees, reminders, visibility } = req.body;

    // Validation
    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'title, startTime, and endTime are required',
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time',
      });
    }

    // Check for conflicts with non-recurring events
    const conflictingEvents = await Event.find({
      recurrence: { type: 'none' },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } },
      ],
    });

    if (conflictingEvents.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Event conflicts with existing events',
        conflicts: conflictingEvents.map((e) => ({
          id: e.id,
          title: e.title,
          startTime: e.startTime,
          endTime: e.endTime,
        })),
      });
    }

    const event = new Event({
      id: uuidv4(),
      title,
      description: description || '',
      startTime: start,
      endTime: end,
      allDay: allDay || false,
      color: color || 'blueberry',
      location: location || '',
      recurrence: recurrence || { type: 'none' },
      attendees: attendees || [],
      reminders: reminders || [{ type: 'notification', minutesBefore: 15 }],
      visibility: visibility || 'private',
    });

    await event.save();

    res.status(201).json({
      success: true,
      data: formatEventResponse(event),
    });
  } catch (error) {
    next(error);
  }
};

// Update event
exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const event = await Event.findOne({ id });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Validate time changes
    if (updates.startTime || updates.endTime) {
      const start = new Date(updates.startTime || event.startTime);
      const end = new Date(updates.endTime || event.endTime);

      if (end <= start) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time',
        });
      }

      // Check for conflicts
      const conflictingEvents = await Event.find({
        id: { $ne: id },
        recurrence: { type: 'none' },
        $or: [
          { startTime: { $lt: end }, endTime: { $gt: start } },
        ],
      });

      if (conflictingEvents.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Event conflicts with existing events',
          conflicts: conflictingEvents.map((e) => ({
            id: e.id,
            title: e.title,
            startTime: e.startTime,
            endTime: e.endTime,
          })),
        });
      }
    }

    Object.assign(event, updates);
    await event.save();

    res.json({
      success: true,
      data: formatEventResponse(event),
    });
  } catch (error) {
    next(error);
  }
};

// Delete event
exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({ id });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    await Event.deleteOne({ id });

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Search events
exports.searchEvents = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'query parameter is required',
      });
    }

    const events = await Event.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    res.json({
      success: true,
      data: events.map(formatEventResponse),
    });
  } catch (error) {
    next(error);
  }
};
