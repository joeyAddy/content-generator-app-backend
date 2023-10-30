const jwt = require("jsonwebtoken");
const catchAsync = require("../util/catchAsync");
const uuid = require("uuid");

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

exports.submitFileScan = catchAsync(async (req, res) => {
  const id = uuid.v4();
  const { accessToken, base64 } = req.body;
  const headers = {
    "Content-type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const data = {
    base64: base64,
    filename: "file.txt",
    properties: {
      webhooks: {
        status: `https://cg-backend-bmn4.onrender.com/api/copyleaks/webhook/{STATUS}/${id}`,
      },
    },
  };

  const options = {
    method: "PUT",
    headers: headers,
    data: data,
    url: `https://api.copyleaks.com/v3/scans/submit/file/${id}`,
  };

  try {
    const response = await axios(options);
    console.log(response.status);
    sendSuccessResponse(
      res,
      { id, status: response.status },
      "submitted file successfully",
      200
    );
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, "Failed to submit file to CopyLeaks.", 500);
  }
});

exports.startScan = catchAsync(async (req, res) => {
  const { id, accessToken } = req.body;
  const headers = {
    "Content-type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const data = {
    trigger: [`${id}`],
    errorHandling: 0,
  };

  const options = {
    method: "PATCH",
    headers: headers,
    data: data,
    url: "https://api.copyleaks.com/v3/scans/start",
  };

  try {
    const response = await axios(options);
    console.log(response.data);
    sendSuccessResponse(
      res,
      response.data,
      "Started scanning file successfully",
      200
    );
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, "Failed to start scanning file in CopyLeaks.", 500);
  }
});

exports.completedScan = catchAsync(async (req, res) => {
  console.log("====================================");
  console.log(req.body);
  console.log("====================================");
});

exports.errorScan = catchAsync(async (req, res) => {
  console.log("====================================");
  console.log(req.body);
  console.log("====================================");
});

exports.creditsChecked = catchAsync(async (req, res) => {
  console.log("====================================");
  console.log(req.body);
  console.log("====================================");
});
