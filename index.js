require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const http = require("http");

const { initializeSocket } = require("./src/services/socketService");
const setup = require("./api/routes");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

app.use(express.json());

// Set security HTTP headers
app.use(helmet());

// Sanitize request data
app.use(mongoSanitize());

// Enable CORS
app.use(cors());
app.options("*", cors());

// Parse JSON request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Custom logger format
logger.token("status-format", (req, res) => {
  const status = res.statusCode;
  if (status >= 200 && status < 300) {
    return "🟢";
  } else if (status >= 300 && status < 400) {
    return "🔵";
  } else {
    return "🔴";
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

setup(app);
initializeSocket(server);

// Start server
server.listen(port, () => {
  console.log(`Server Running on port http://localhost:${port}`);
});
