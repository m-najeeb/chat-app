require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const http = require("http");
const path = require("path");

const SocketService = require("./src/services/socketService");
const setup = require("./api/routes");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// Serve static files from client folder
app.use(express.static(path.join(__dirname, "client")));

// Middleware setup
app.use(express.json());
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Sanitize MongoDB queries
app.use(cors()); // Enable CORS
app.options("*", cors()); // Handle preflight requests
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Custom logger format
logger.token("status-format", (req, res) => {
  const status = res.statusCode;
  if (status >= 200 && status < 300) {
    return "🟢"; // Success
  } else if (status >= 300 && status < 400) {
    return "🔵"; // Redirect
  } else {
    return "🔴"; // Error
  }
});
app.use(logger(":method :url :status-format :status :response-time ms"));

// Test route
app.get("/", (req, res) => {
  res.send("Hello, Server is Up and Running!");
});

// MongoDB connection
const dbUri = process.env.DB_URI;
mongoose
  .connect(dbUri)
  .then(() => console.log("Database Connected Successfully"))
  .catch((error) => {
    console.error("DB Connection Error:", error);
    process.exit(1);
  });

// Setup routes
setup(app);

// Initialize Socket.IO
SocketService.initializeSocket(server);

// Start server
server.listen(port, () => {
  console.log(`Server Running on port http://localhost:${port}`);
});
