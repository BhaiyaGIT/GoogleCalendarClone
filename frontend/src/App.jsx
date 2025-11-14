import React, { useEffect } from "react";
import { motion } from "framer-motion";
import CalendarMonth from "./components/CalendarMonth";
import EventModal from "./components/EventModal";
import { useCalendarStore } from "./utils/store";
import "./styles/global.css";
import "./App.css";

function App() {
	const { currentDate, setCurrentDate, view } = useCalendarStore();

	useEffect(() => {
		// Initialize calendar on mount
		setCurrentDate(new Date());
	}, []);

	return (
		<motion.div
			className="app"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className="app-container">
				{/* Main Calendar View */}
				<main className="calendar-main">
					{view === "month" && <CalendarMonth />}
				</main>
			</div>

			{/* Event Modal */}
			<EventModal />
		</motion.div>
	);
}

export default App;
