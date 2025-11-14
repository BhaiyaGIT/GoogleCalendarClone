import create from "zustand";
import { eventAPI } from "../utils/api";

export const useCalendarStore = create((set, get) => ({
	// State
	events: [],
	selectedEvent: null,
	isModalOpen: false,
	currentDate: new Date(),
	view: "month", // 'month', 'week', 'day'
	searchQuery: "",
	isLoading: false,
	error: null,

	// Actions
	setEvents: (events) => set({ events }),
	setSelectedEvent: (event) => set({ selectedEvent: event }),
	setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
	setCurrentDate: (date) => set({ currentDate: date }),
	setView: (view) => set({ view }),
	setSearchQuery: (query) => set({ searchQuery: query }),
	setIsLoading: (loading) => set({ isLoading: loading }),
	setError: (error) => set({ error }),

	// Fetch events for date range
	fetchEvents: async (startDate, endDate) => {
		set({ isLoading: true, error: null });
		try {
			const response = await eventAPI.getEvents(startDate, endDate);
			set({ events: response.data.data || [] });
		} catch (error) {
			set({ error: error.message });
			console.error("Error fetching events:", error);
		} finally {
			set({ isLoading: false });
		}
	},

	// Create event
	createEvent: async (eventData) => {
		set({ isLoading: true, error: null });
		try {
			const response = await eventAPI.createEvent(eventData);
			const newEvent = response.data.data;
			set((state) => ({
				events: [...state.events, newEvent],
				selectedEvent: newEvent,
			}));
			return newEvent;
		} catch (error) {
			set({ error: error.response?.data?.message || error.message });
			throw error;
		} finally {
			set({ isLoading: false });
		}
	},

	// Update event
	updateEvent: async (id, eventData) => {
		set({ isLoading: true, error: null });
		try {
			const response = await eventAPI.updateEvent(id, eventData);
			const updatedEvent = response.data.data;
			set((state) => ({
				events: state.events.map((e) => (e.id === id ? updatedEvent : e)),
				selectedEvent: updatedEvent,
			}));
			return updatedEvent;
		} catch (error) {
			set({ error: error.response?.data?.message || error.message });
			throw error;
		} finally {
			set({ isLoading: false });
		}
	},

	// Delete event
	deleteEvent: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await eventAPI.deleteEvent(id);
			set((state) => ({
				events: state.events.filter((e) => e.id !== id),
				selectedEvent: null,
			}));
		} catch (error) {
			set({ error: error.response?.data?.message || error.message });
			throw error;
		} finally {
			set({ isLoading: false });
		}
	},

	// Search events
	searchEvents: async (query) => {
		if (!query.trim()) {
			return;
		}
		set({ isLoading: true, error: null });
		try {
			const response = await eventAPI.searchEvents(query);
			set({ events: response.data.data || [] });
		} catch (error) {
			set({ error: error.message });
			console.error("Error searching events:", error);
		} finally {
			set({ isLoading: false });
		}
	},

	// Close modal and clear selection
	closeModal: () => set({ isModalOpen: false, selectedEvent: null }),

	// Open modal with event
	openEventModal: (event) => set({ selectedEvent: event, isModalOpen: true }),

	// Open new event modal
	openNewEventModal: () => set({ isModalOpen: true, selectedEvent: null }),
}));
