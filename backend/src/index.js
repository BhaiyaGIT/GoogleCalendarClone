const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const eventRoutes = require("./routes/events");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(
			process.env.MONGODB_URI ||
				"mongodb://localhost:27017/google-calendar-clone",
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		console.log("MongoDB connected:", conn.connection.host);
	} catch (error) {
		console.error("MongoDB connection error:", error.message);
		process.exit(1);
	}
};

connectDB();

// Routes
app.use("/api/events", eventRoutes);

// Health check
app.get("/api/health", (req, res) => {
	res.json({ success: true, message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;
