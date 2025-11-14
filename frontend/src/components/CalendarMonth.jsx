import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
	getMonthDays,
	getMonthYear,
	isToday,
	isCurrentMonth,
	getEventsByDay,
	formatTime,
} from "../utils/dateUtils";
import { useCalendarStore } from "../utils/store";
import EventCard from "./EventCard";
import "./CalendarMonth.css";

const CalendarMonth = () => {
	const {
		currentDate,
		setCurrentDate,
		events,
		fetchEvents,
		openNewEventModal,
		openEventModal,
		nextMonth: navigateNextMonth,
		previousMonth: navigatePreviousMonth,
	} = useCalendarStore();

	// Fetch events on mount and when currentDate changes
	useEffect(() => {
		const monthStart = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			1
		);
		const monthEnd = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() + 1,
			0
		);
		fetchEvents(monthStart, monthEnd);
	}, [currentDate]);

	const days = getMonthDays(currentDate);
	const monthYear = getMonthYear(currentDate);

	const handlePreviousMonth = () => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() - 1);
		setCurrentDate(newDate);
	};

	const handleNextMonth = () => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() + 1);
		setCurrentDate(newDate);
	};

	const handleToday = () => {
		setCurrentDate(new Date());
	};

	const handleDayClick = (day) => {
		if (!isCurrentMonth(day, currentDate)) {
			setCurrentDate(day);
		}
	};

	const handleCreateEvent = (day) => {
		openNewEventModal();
		// Store selected date for new event creation
		sessionStorage.setItem("selectedDate", day.toISOString());
	};

	const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	return (
		<motion.div
			className="calendar-month"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			{/* Header */}
			<div className="calendar-header">
				<div className="header-title-section">
					<h1 className="header-title">{monthYear}</h1>
					<button
						className="btn-today"
						onClick={handleToday}
					>
						Today
					</button>
				</div>
				<div className="header-controls">
					<button
						className="btn-icon"
						onClick={handlePreviousMonth}
						aria-label="Previous month"
					>
						<ChevronLeft size={20} />
					</button>
					<button
						className="btn-icon"
						onClick={handleNextMonth}
						aria-label="Next month"
					>
						<ChevronRight size={20} />
					</button>
					<button
						className="btn-create"
						onClick={openNewEventModal}
					>
						<Plus size={20} />
						<span>Create</span>
					</button>
				</div>
			</div>

			{/* Calendar Grid */}
			<div className="calendar-grid">
				{/* Week day headers */}
				<div className="week-header">
					{weekDays.map((day) => (
						<div
							key={day}
							className="week-day-header"
						>
							{day}
						</div>
					))}
				</div>

				{/* Days grid */}
				<div className="days-grid">
					{days.map((day, index) => {
						const isCurrentMonthDay = isCurrentMonth(day, currentDate);
						const isTodayDate = isToday(day);
						const dayEvents = getEventsByDay(events, day);

						return (
							<motion.div
								key={index}
								className={`day-cell ${
									!isCurrentMonthDay ? "other-month" : ""
								} ${isTodayDate ? "today" : ""}`}
								onClick={() => handleDayClick(day)}
								whileHover={{ backgroundColor: "var(--bg-secondary)" }}
								transition={{ duration: 0.2 }}
							>
								<div className="day-header">
									<span
										className={`day-number ${isTodayDate ? "today-badge" : ""}`}
									>
										{day.getDate()}
									</span>
									<button
										className="btn-add-event"
										onClick={(e) => {
											e.stopPropagation();
											handleCreateEvent(day);
										}}
										aria-label={`Add event for ${day.toDateString()}`}
									>
										<Plus size={16} />
									</button>
								</div>

								<div className="day-events">
									{dayEvents.slice(0, 3).map((event) => (
										<motion.div
											key={event.id}
											onClick={(e) => {
												e.stopPropagation();
												openEventModal(event);
											}}
											whileHover={{ scale: 1.02 }}
											transition={{ duration: 0.2 }}
										>
											<EventCard
												event={event}
												compact={true}
											/>
										</motion.div>
									))}
									{dayEvents.length > 3 && (
										<div className="more-events">
											+{dayEvents.length - 3} more
										</div>
									)}
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</motion.div>
	);
};

export default CalendarMonth;
