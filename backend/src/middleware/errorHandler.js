const errorHandler = (err, req, res, next) => {
	console.error(err.stack);

	if (err.name === "ValidationError") {
		return res.status(400).json({
			success: false,
			message: "Validation error",
			errors: Object.values(err.errors).map((e) => e.message),
		});
	}

	if (err.name === "CastError") {
		return res.status(400).json({
			success: false,
			message: "Invalid ID format",
		});
	}

	if (err.name === "MongoServerError" && err.code === 11000) {
		return res.status(409).json({
			success: false,
			message: "Duplicate entry",
		});
	}

	res.status(err.status || 500).json({
		success: false,
		message: err.message || "Internal server error",
	});
};

module.exports = errorHandler;
