require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const setup = require("./api/routes");

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options("*", cors());

// parse json request body
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

//test route
app.get("/", (req, res) => {
  res.send("Hello, Server is Up and Running!");
});

// mongo connection
const dbUri = process.env.DB_URI;
mongoose
  .connect(dbUri)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((error) => {
    console.log("db error", error);
    process.exit(1);
  });

setup(app);

// port listening
app.listen(port, () => {
  console.log(`Server Running on port http://localhost:${port}`);
});
