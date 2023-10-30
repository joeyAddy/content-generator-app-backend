const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const userRouter = require("./router/userRouter");
const copyleaksRoute = require("./router/copyleaksRoute");

// Middleware
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// User Route
app.use("/api/user", userRouter);

//Coplyleaks Route
app.use("/api/copyleaks", copyleaksRoute);

module.exports = app;
