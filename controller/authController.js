const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../util/catchAsync");
const AppError = require("./../util/appError");
const sendEmail = require("./../util/email");
const User = require("./../model/userModel");
const { default: mongoose } = require("mongoose");

// Make JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const myToken = createToken(user._id);
  res.status(statusCode).json({
    status: "ok",
    token: myToken,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const createUser = await User.create({
    email: req.body.email,
    fullName: req.body.fullName,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    profileImage: req.body.profileImage,
  });

  const emailMessage = `
  <html>
    <head>
      <style>
        /* Add your CSS styles here */
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          text-align: center;
        }
        .container {
          background-color: #ffffff;
          border-radius: 10px;
          padding: 20px;
          margin: 20px auto;
          max-width: 600px;
        }
        .header {
          background-color: #0078d4;
          color: #fff;
          padding: 10px;
          border-radius: 10px 10px 0 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to CG</h1>
        </div>
        <p>Hello ${createUser.fullName},</p>
        <p>Thank you for signing up with CG. We're excited to have you on board!</p>
      </div>
    </body>
  </html>
`;

  try {
    // Email data pass to email.js
    await sendEmail({
      email: createUser.email,
      subject: "Sign-Up Notification",
      message: emailMessage,
    });

    // response data
    createUser.password = undefined; // hide pass from response
    createSendToken(createUser, 201, res);
  } catch (error) {
    return next(new AppError("Somthing problem here!!!", 500));
  }
});

exports.signin = catchAsync(async (req, res, next) => {
  let user = null;
  const { email, password } = req.body;
  // Check email and password exist
  if (!email && !password) {
    return next(new AppError("provide correct login details", 400));
  }

  // Check if user exists & password is correct
  user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    res.json({ data: { message: "Invalid email or password", status: 401 } });
    return next(new AppError("Incorrect email or password", 401));
  }

  try {
    if (user === null) return;
    // Email data pass to email.js
    await sendEmail({
      email: user.email,
      subject: "LogIn Notification",
      message: `Login successful, ${user.name}!`,
    });

    // response data
    user.password = undefined; // hide pass from response
    createSendToken(user, 200, res);
  } catch (error) {
    return next(new AppError("Something is the problem here!", 500));
  }
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: "ok",
    length: users.length,
    data: {
      users,
    },
  });
});

// Restrict user route
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

// Get current user Info from JWT token
exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check of it's there
  let token,
    reqHeader = req.headers.authorization;

  if (reqHeader && reqHeader.startsWith("Bearer")) {
    token = reqHeader.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    next(
      new AppError("User recently changed password! Please login again", 401)
    );
  }
  // assign current user data on (req.user)
  req.user = currentUser;
  next();
});
