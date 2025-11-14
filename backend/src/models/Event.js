const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			unique: true,
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 255,
		},
		description: {
			type: String,
			default: "",
			maxlength: 2000,
		},
		startTime: {
			type: Date,
			required: true,
		},
		endTime: {
			type: Date,
			required: true,
		},
		allDay: {
			type: Boolean,
			default: false,
		},
		color: {
			type: String,
			enum: [
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
			],
			default: "blueberry",
		},
		location: {
			type: String,
			default: "",
		},
		recurrence: {
			type: {
				type: String,
				enum: ["none", "daily", "weekly", "monthly", "yearly"],
				default: "none",
			},
			endDate: Date,
			daysOfWeek: [Number], // For weekly recurrence
		},
		attendees: [
			{
				email: String,
				name: String,
				status: {
					type: String,
					enum: ["invited", "accepted", "declined", "tentative"],
					default: "invited",
				},
			},
		],
		reminders: [
			{
				type: {
					type: String,
					enum: ["notification", "email"],
					default: "notification",
				},
				minutesBefore: {
					type: Number,
					default: 15,
				},
			},
		],
		visibility: {
			type: String,
			enum: ["public", "private", "confidential"],
			default: "private",
		},
		isRecurringInstance: {
			type: Boolean,
			default: false,
		},
		recurringEventId: String,
		parentRecurringEvent: mongoose.Schema.Types.ObjectId,
	},
	{
		timestamps: true,
	}
);

// Validate that endTime is after startTime
eventSchema.pre("save", function (next) {
	if (this.endTime <= this.startTime) {
		next(new Error("End time must be after start time"));
	} else {
		next();
	}
});

// Index for efficient querying
eventSchema.index({ startTime: 1, endTime: 1 });
eventSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Event", eventSchema);
