import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	X,
	Clock,
	MapPin,
	Bell,
	Users,
	Plus,
	Trash2,
	Save,
} from "lucide-react";
import { useCalendarStore } from "../utils/store";
import { formatDateTime } from "../utils/dateUtils";
import "./EventModal.css";

const EventModal = () => {
	const {
		isModalOpen,
		selectedEvent,
		closeModal,
		createEvent,
		updateEvent,
		deleteEvent,
	} = useCalendarStore();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		startTime: "",
		endTime: "",
		allDay: false,
		color: "blueberry",
		location: "",
		reminders: [{ type: "notification", minutesBefore: 15 }],
		attendees: [],
		visibility: "private",
		recurrence: { type: "none" },
	});

	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	// Initialize form with selected event or defaults
	useEffect(() => {
		if (selectedEvent) {
			setFormData({
				title: selectedEvent.title || "",
				description: selectedEvent.description || "",
				startTime: new Date(selectedEvent.startTime).toISOString().slice(0, 16),
				endTime: new Date(selectedEvent.endTime).toISOString().slice(0, 16),
				allDay: selectedEvent.allDay || false,
				color: selectedEvent.color || "blueberry",
				location: selectedEvent.location || "",
				reminders: selectedEvent.reminders || [
					{ type: "notification", minutesBefore: 15 },
				],
				attendees: selectedEvent.attendees || [],
				visibility: selectedEvent.visibility || "private",
				recurrence: selectedEvent.recurrence || { type: "none" },
			});
		} else {
			// Set default times for new event
			const selectedDate = sessionStorage.getItem("selectedDate");
			const startDate = selectedDate ? new Date(selectedDate) : new Date();
			const endDate = new Date(startDate.getTime() + 60 * 60000); // 1 hour later

			setFormData({
				title: "",
				description: "",
				startTime: startDate.toISOString().slice(0, 16),
				endTime: endDate.toISOString().slice(0, 16),
				allDay: false,
				color: "blueberry",
				location: "",
				reminders: [{ type: "notification", minutesBefore: 15 }],
				attendees: [],
				visibility: "private",
				recurrence: { type: "none" },
			});
			sessionStorage.removeItem("selectedDate");
		}
		setErrors({});
	}, [selectedEvent, isModalOpen]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		// Clear error for this field
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleRecurrenceChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			recurrence: {
				...prev.recurrence,
				[name]: value,
			},
		}));
	};

	const addReminder = () => {
		setFormData((prev) => ({
			...prev,
			reminders: [
				...prev.reminders,
				{ type: "notification", minutesBefore: 15 },
			],
		}));
	};

	const removeReminder = (index) => {
		setFormData((prev) => ({
			...prev,
			reminders: prev.reminders.filter((_, i) => i !== index),
		}));
	};

	const addAttendee = () => {
		setFormData((prev) => ({
			...prev,
			attendees: [
				...prev.attendees,
				{ email: "", name: "", status: "invited" },
			],
		}));
	};

	const removeAttendee = (index) => {
		setFormData((prev) => ({
			...prev,
			attendees: prev.attendees.filter((_, i) => i !== index),
		}));
	};

	const updateAttendee = (index, field, value) => {
		setFormData((prev) => ({
			...prev,
			attendees: prev.attendees.map((att, i) =>
				i === index ? { ...att, [field]: value } : att
			),
		}));
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Event title is required";
		}

		const startTime = new Date(formData.startTime);
		const endTime = new Date(formData.endTime);

		if (!formData.allDay && endTime <= startTime) {
			newErrors.endTime = "End time must be after start time";
		}

		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = validateForm();

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setIsLoading(true);
		try {
			if (selectedEvent) {
				await updateEvent(selectedEvent.id, formData);
			} else {
				await createEvent(formData);
			}
			closeModal();
		} catch (error) {
			setErrors({ submit: error.message });
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!selectedEvent) return;

		if (window.confirm("Are you sure you want to delete this event?")) {
			setIsLoading(true);
			try {
				await deleteEvent(selectedEvent.id);
				closeModal();
			} catch (error) {
				setErrors({ submit: error.message });
			} finally {
				setIsLoading(false);
			}
		}
	};

	const colors = [
		"tomato",
		"flamingo",
		"tangerine",
		"banana",
		"sage",
		"basil",
		"peacock",
		"blueberry",
		"lavender",
		"grape",
		"graphite",
	];

	return (
		<AnimatePresence>
			{isModalOpen && (
				<motion.div
					className="event-modal-overlay"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={closeModal}
				>
					<motion.div
						className="event-modal"
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="modal-header">
							<h2>{selectedEvent ? "Edit Event" : "Create Event"}</h2>
							<button
								className="btn-close"
								onClick={closeModal}
							>
								<X size={24} />
							</button>
						</div>

						{/* Form */}
						<form
							onSubmit={handleSubmit}
							className="modal-form"
						>
							{/* Title */}
							<div className="form-group">
								<label htmlFor="title">Event Title *</label>
								<input
									type="text"
									id="title"
									name="title"
									value={formData.title}
									onChange={handleInputChange}
									placeholder="Enter event title"
									className={errors.title ? "input-error" : ""}
								/>
								{errors.title && (
									<span className="error-text">{errors.title}</span>
								)}
							</div>

							{/* Description */}
							<div className="form-group">
								<label htmlFor="description">Description</label>
								<textarea
									id="description"
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									placeholder="Add event description"
									rows="3"
								/>
							</div>

							{/* Date and Time */}
							<div className="form-row">
								<div className="form-group">
									<label htmlFor="startTime">Start Date & Time *</label>
									<input
										type="datetime-local"
										id="startTime"
										name="startTime"
										value={formData.startTime}
										onChange={handleInputChange}
									/>
								</div>
								<div className="form-group">
									<label htmlFor="endTime">End Date & Time *</label>
									<input
										type="datetime-local"
										id="endTime"
										name="endTime"
										value={formData.endTime}
										onChange={handleInputChange}
										className={errors.endTime ? "input-error" : ""}
									/>
									{errors.endTime && (
										<span className="error-text">{errors.endTime}</span>
									)}
								</div>
							</div>

							{/* All Day Toggle */}
							<div className="form-group checkbox">
								<input
									type="checkbox"
									id="allDay"
									name="allDay"
									checked={formData.allDay}
									onChange={handleInputChange}
								/>
								<label htmlFor="allDay">All day event</label>
							</div>

							{/* Location */}
							<div className="form-group">
								<label htmlFor="location">
									<MapPin size={16} />
									Location
								</label>
								<input
									type="text"
									id="location"
									name="location"
									value={formData.location}
									onChange={handleInputChange}
									placeholder="Add location"
								/>
							</div>

							{/* Color */}
							<div className="form-group">
								<label>Event Color</label>
								<div className="color-picker">
									{colors.map((color) => (
										<button
											key={color}
											type="button"
											className={`color-option event-${color} ${
												formData.color === color ? "selected" : ""
											}`}
											onClick={() =>
												setFormData((prev) => ({ ...prev, color }))
											}
											aria-label={`Select ${color} color`}
										/>
									))}
								</div>
							</div>

							{/* Recurrence */}
							<div className="form-group">
								<label htmlFor="recurrence">Repeat</label>
								<select
									id="recurrence"
									name="type"
									value={formData.recurrence.type}
									onChange={handleRecurrenceChange}
								>
									<option value="none">Does not repeat</option>
									<option value="daily">Daily</option>
									<option value="weekly">Weekly</option>
									<option value="monthly">Monthly</option>
									<option value="yearly">Yearly</option>
								</select>
							</div>

							{/* Reminders */}
							<div className="form-group">
								<label>
									<Bell size={16} />
									Reminders
								</label>
								{formData.reminders.map((reminder, index) => (
									<div
										key={index}
										className="reminder-item"
									>
										<input
											type="number"
											value={reminder.minutesBefore}
											onChange={(e) => {
												const newReminders = [...formData.reminders];
												newReminders[index].minutesBefore = parseInt(
													e.target.value
												);
												setFormData((prev) => ({
													...prev,
													reminders: newReminders,
												}));
											}}
											min="0"
										/>
										<span>minutes before</span>
										<button
											type="button"
											className="btn-remove"
											onClick={() => removeReminder(index)}
										>
											<Trash2 size={16} />
										</button>
									</div>
								))}
								<button
									type="button"
									className="btn-add"
									onClick={addReminder}
								>
									<Plus size={16} />
									Add reminder
								</button>
							</div>

							{/* Attendees */}
							<div className="form-group">
								<label>
									<Users size={16} />
									Attendees
								</label>
								{formData.attendees.map((attendee, index) => (
									<div
										key={index}
										className="attendee-item"
									>
										<input
											type="email"
											value={attendee.email}
											onChange={(e) =>
												updateAttendee(index, "email", e.target.value)
											}
											placeholder="Email"
										/>
										<input
											type="text"
											value={attendee.name}
											onChange={(e) =>
												updateAttendee(index, "name", e.target.value)
											}
											placeholder="Name"
										/>
										<button
											type="button"
											className="btn-remove"
											onClick={() => removeAttendee(index)}
										>
											<Trash2 size={16} />
										</button>
									</div>
								))}
								<button
									type="button"
									className="btn-add"
									onClick={addAttendee}
								>
									<Plus size={16} />
									Add attendee
								</button>
							</div>

							{/* Visibility */}
							<div className="form-group">
								<label htmlFor="visibility">Visibility</label>
								<select
									id="visibility"
									name="visibility"
									value={formData.visibility}
									onChange={handleInputChange}
								>
									<option value="private">Private</option>
									<option value="public">Public</option>
									<option value="confidential">Confidential</option>
								</select>
							</div>

							{/* Error Message */}
							{errors.submit && (
								<div className="error-message">{errors.submit}</div>
							)}

							{/* Actions */}
							<div className="modal-actions">
								{selectedEvent && (
									<button
										type="button"
										className="btn-delete"
										onClick={handleDelete}
										disabled={isLoading}
									>
										<Trash2 size={18} />
										Delete
									</button>
								)}
								<div className="spacer" />
								<button
									type="button"
									className="btn-cancel"
									onClick={closeModal}
									disabled={isLoading}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="btn-save"
									disabled={isLoading}
								>
									<Save size={18} />
									{isLoading ? "Saving..." : "Save Event"}
								</button>
							</div>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default EventModal;
