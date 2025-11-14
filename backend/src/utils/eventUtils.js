const { v4: uuidv4 } = require("uuid");
const {
	addDays,
	addWeeks,
	addMonths,
	addYears,
	startOfDay,
	endOfDay,
	isSameDay,
	isAfter,
	isBefore,
	format,
} = require("date-fns");

// Generate recurring event instances
const generateRecurringInstances = (event, startDate, endDate) => {
	const instances = [];
	const recurrence = event.recurrence;

	if (recurrence.type === "none") {
		return [event];
	}

	let currentStart = new Date(event.startTime);
	const eventDuration = event.endTime - event.startTime;
	const recurrenceEnd = recurrence.endDate
		? new Date(recurrence.endDate)
		: new Date(endDate);

	while (currentStart <= recurrenceEnd && currentStart <= endDate) {
		if (currentStart >= startDate) {
			instances.push({
				...event,
				_id: undefined,
				id: `${event.id}-${format(currentStart, "yyyyMMdd")}`,
				startTime: new Date(currentStart),
				endTime: new Date(new Date(currentStart).getTime() + eventDuration),
				isRecurringInstance: true,
				recurringEventId: event.id,
			});
		}

		// Calculate next occurrence
		switch (recurrence.type) {
			case "daily":
				currentStart = addDays(currentStart, 1);
				break;
			case "weekly":
				currentStart = addWeeks(currentStart, 1);
				break;
			case "monthly":
				currentStart = addMonths(currentStart, 1);
				break;
			case "yearly":
				currentStart = addYears(currentStart, 1);
				break;
			default:
				break;
		}
	}

	return instances;
};

// Check for event conflicts
const checkEventConflict = (events, newEvent) => {
	return events.some(
		(event) =>
			event.id !== newEvent.id &&
			((newEvent.startTime < event.endTime &&
				newEvent.startTime >= event.startTime) ||
				(newEvent.endTime > event.startTime &&
					newEvent.endTime <= event.endTime) ||
				(newEvent.startTime <= event.startTime &&
					newEvent.endTime >= event.endTime))
	);
};

// Get events in date range
const getEventsByDateRange = async (EventModel, startDate, endDate) => {
	return EventModel.find({
		$or: [
			{
				startTime: { $gte: startDate, $lt: endDate },
			},
			{
				endTime: { $gt: startDate, $lte: endDate },
			},
			{
				startTime: { $lte: startDate },
				endTime: { $gte: endDate },
			},
		],
	}).sort({ startTime: 1 });
};

// Format event for response
const formatEventResponse = (event) => {
	return {
		id: event.id,
		title: event.title,
		description: event.description,
		startTime: event.startTime,
		endTime: event.endTime,
		allDay: event.allDay,
		color: event.color,
		location: event.location,
		recurrence: event.recurrence,
		attendees: event.attendees,
		reminders: event.reminders,
		visibility: event.visibility,
		isRecurringInstance: event.isRecurringInstance,
		recurringEventId: event.recurringEventId,
	};
};

module.exports = {
	generateRecurringInstances,
	checkEventConflict,
	getEventsByDateRange,
	formatEventResponse,
};
