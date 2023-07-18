const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const userRouter = require("./router/userRouter");
const rideRouter = require("./router/rideRouter");
const riderRouter = require("./router/riderRouter");

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    // "https://k-track.netlify.app",
    methods: "GET,POST,PATCH,DELETE",
    // credentials: true,
  })
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// User Route
app.use("/api/user", userRouter);
app.use("/api/ride", rideRouter);
app.use("/api/rider", riderRouter);

module.exports = app;
