import React from "react";
import { formatTime } from "../utils/dateUtils";
import "./EventCard.css";

const EventCard = ({ event, compact = false }) => {
	return (
		<div className={`event-card event-${event.color || "blueberry"}`}>
			{!compact && (
				<div className="event-time">
					{formatTime(event.startTime)} - {formatTime(event.endTime)}
				</div>
			)}
			<div className="event-title">{event.title}</div>
			{!compact && event.description && (
				<div className="event-description">{event.description}</div>
			)}
			{event.location && <div className="event-location">{event.location}</div>}
		</div>
	);
};

export default EventCard;
