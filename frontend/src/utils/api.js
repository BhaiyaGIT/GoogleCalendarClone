import axios from "axios";

const API_BASE_URL =
	process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const eventAPI = {
	// Get events for a date range
	getEvents: (startDate, endDate) => {
		return apiClient.get("/events", {
			params: {
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
			},
		});
	},

	// Get single event
	getEvent: (id) => {
		return apiClient.get(`/events/${id}`);
	},

	// Create event
	createEvent: (eventData) => {
		return apiClient.post("/events", eventData);
	},

	// Update event
	updateEvent: (id, eventData) => {
		return apiClient.put(`/events/${id}`, eventData);
	},

	// Delete event
	deleteEvent: (id) => {
		return apiClient.delete(`/events/${id}`);
	},

	// Search events
	searchEvents: (query) => {
		return apiClient.get("/events/search", {
			params: { query },
		});
	},
};

export default apiClient;
