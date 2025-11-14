import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	startOfDay,
	endOfDay,
	eachDayOfInterval,
	eachHourOfInterval,
	format,
	isSameMonth,
	isSameDay,
	addDays,
	addMonths,
	subMonths,
	getDay,
	getDate,
	parse,
	differenceInMinutes,
	differenceInHours,
	isWithinInterval,
} from "date-fns";

// Get days to display in month view (includes days from prev/next month)
export const getMonthDays = (date) => {
	const monthStart = startOfMonth(date);
	const monthEnd = endOfMonth(date);
	const weekStart = startOfWeek(monthStart, { weekStartsOn: 0 });
	const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

	return eachDayOfInterval({ start: weekStart, end: weekEnd });
};

// Get week days
export const getWeekDays = (date) => {
	const weekStart = startOfWeek(date, { weekStartsOn: 0 });
	const weekEnd = endOfWeek(date, { weekStartsOn: 0 });

	return eachDayOfInterval({ start: weekStart, end: weekEnd });
};

// Get hours for day view (8 AM to 8 PM)
export const getDayHours = (date) => {
	const dayStart = new Date(date);
	dayStart.setHours(8, 0, 0, 0);
	const dayEnd = new Date(date);
	dayEnd.setHours(20, 0, 0, 0);

	return eachHourOfInterval({ start: dayStart, end: dayEnd });
};

// Check if event is in date range
export const isEventInRange = (event, startDate, endDate) => {
	return (
		isWithinInterval(new Date(event.startTime), {
			start: startDate,
			end: endDate,
		}) ||
		isWithinInterval(new Date(event.endTime), {
			start: startDate,
			end: endDate,
		}) ||
		(new Date(event.startTime) <= startDate &&
			new Date(event.endTime) >= endDate)
	);
};

// Get event position and height for calendar grid
export const getEventPosition = (event, dayStart) => {
	const eventStart = new Date(event.startTime);
	const eventEnd = new Date(event.endTime);

	const dayEnd = new Date(dayStart);
	dayEnd.setHours(20, 0, 0, 0);

	const dayBegin = new Date(dayStart);
	dayBegin.setHours(8, 0, 0, 0);

	// Handle all-day events
	if (event.allDay) {
		return {
			top: 0,
			height: 100,
			isAllDay: true,
		};
	}

	// Calculate position within the day grid (8 AM to 8 PM)
	const minutesFromStart = differenceInMinutes(eventStart, dayBegin);
	const eventDurationMinutes = differenceInMinutes(eventEnd, eventStart);

	const top = (minutesFromStart / 720) * 100; // 720 minutes in 12 hours
	const height = (eventDurationMinutes / 720) * 100;

	return {
		top: Math.max(0, top),
		height: Math.max(20, height),
		isAllDay: false,
	};
};

// Format time for display
export const formatTime = (date) => {
	return format(new Date(date), "h:mm a");
};

// Format date for display
export const formatDate = (date) => {
	return format(new Date(date), "MMM d, yyyy");
};

// Format date and time
export const formatDateTime = (date) => {
	return format(new Date(date), "MMM d, yyyy h:mm a");
};

// Get month and year string
export const getMonthYear = (date) => {
	return format(date, "MMMM yyyy");
};

// Check if date is today
export const isToday = (date) => {
	return isSameDay(date, new Date());
};

// Check if date is in current month
export const isCurrentMonth = (date, monthDate) => {
	return isSameMonth(date, monthDate);
};

// Navigate to previous month
export const previousMonth = (date) => {
	return subMonths(date, 1);
};

// Navigate to next month
export const nextMonth = (date) => {
	return addMonths(date, 1);
};

// Get day of week name
export const getDayName = (date) => {
	return format(date, "EEEE");
};

// Get short day name
export const getShortDayName = (date) => {
	return format(date, "EEE");
};

// Get events for a specific day
export const getEventsByDay = (events, date) => {
	return events.filter((event) => {
		const eventStart = new Date(event.startTime);
		return isSameDay(eventStart, date);
	});
};

// Sort events by start time
export const sortEventsByTime = (events) => {
	return [...events].sort((a, b) => {
		return new Date(a.startTime) - new Date(b.startTime);
	});
};

export default {
	getMonthDays,
	getWeekDays,
	getDayHours,
	isEventInRange,
	getEventPosition,
	formatTime,
	formatDate,
	formatDateTime,
	getMonthYear,
	isToday,
	isCurrentMonth,
	previousMonth,
	nextMonth,
	getDayName,
	getShortDayName,
	getEventsByDay,
	sortEventsByTime,
};
