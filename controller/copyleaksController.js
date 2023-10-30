const jwt = require("jsonwebtoken");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");

// Make JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Function to handle success responses
const sendSuccessResponse = (res, data, message, statusCode) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Function to handle error responses
const sendErrorResponse = (res, errorMessage, statusCode, error) => {
  if (error) {
    res.status(statusCode).json({
      success: "false",
      status: statusCode,
      errorMessage: errorMessage,
      error: error,
    });
  } else {
    res.status(statusCode).json({
      success: "false",
      status: statusCode,
      errorMessage: errorMessage,
    });
  }
};

// copyleaksController.js
const axios = require("axios");

exports.loginToCopyleaks = catchAsync(async (req, res) => {
  const headers = {
    "Content-type": "application/json",
  };

  const data = {
    email: process.env.EMAIL_ADDRESS,
    key: process.env.COPYLEAKS_API_KEY,
  };

  const options = {
    method: "POST",
    headers: headers,
    data: data,
    url: "https://id.copyleaks.com/v3/account/login/api",
  };

  try {
    const response = await axios(options);
    console.log(response.data);
    sendSuccessResponse(res, response.data, "login successfully", 200);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, "Failed to get login to CopyLeaks.", 500);
  }
});
