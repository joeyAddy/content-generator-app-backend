const User = require("../model/userModel");
const catchAsync = require("../util/catchAsync");
const CarRider = require("./../model/riderModel"); // Path to the CarRider model
const AppError = require("./../util/appError");
const sendEmail = require("./../util/email");

// Central function to handle responses
const handleResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: "success",
    data,
  });
};

// Function for creating a rider
exports.createRider = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.user });

    if (user) {
      const newRider = await CarRider.create({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.user,
        phone: req.body.phone,
        address: req.body.address,
      });
      handleResponse(res, 201, newRider);
    } else {
      next(new AppError("User with rider ID not found", 404));
    }
  } catch (error) {
    next(new AppError(error.message, 400));
  }

  try {
    // Email data pass to email.js
    await sendEmail({
      email: user.email,
      subject: "LogIn Notification",
      message: `Login successful, ${user.username}!!!`,
    });

    // response data
    user.password = undefined; // hide pass from response
    createSendToken(user, 200, res);
  } catch (error) {
    return next(new AppError("Somthing problem here!!!", 500));
  }
});

// Function for retrieving a rider
exports.getRider = catchAsync(async (req, res, next) => {
  try {
    const rider = await CarRider.findById({ _id: req.params.id });
    if (!rider) {
      return next(new AppError("Rider not found", 404));
    }
    handleResponse(res, 200, rider);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});

// Function for updating a rider
exports.updateRider = catchAsync(async (req, res, next) => {
  try {
    const updatedRider = await CarRider.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedRider) {
      return next(new AppError("Rider not found", 404));
    }
    handleResponse(res, 200, updatedRider);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

// Function for deleting a rider
exports.deleteRider = catchAsync(async (req, res, next) => {
  try {
    const deletedRider = await CarRider.findByIdAndDelete(req.params.id);
    if (!deletedRider) {
      return next(new AppError("Rider not found", 404));
    }
    handleResponse(res, 204, null); // 204 No Content status for successful deletion
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});
