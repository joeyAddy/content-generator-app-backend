const { default: mongoose } = require("mongoose");
const Ride = require("../model/rideModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("./../util/appError");
const sendEmail = require("./../util/email");

// Central function to handle responses
const handleResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: "success",
    data,
  });
};

// Function for creating a ride
exports.createRide = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.user });

    if (user) {
      const newRide = await Ride.create({
        _id: new mongoose.Types.ObjectId(),
        rideType: req.body.rideType,
        user: req.body.user,
        origin: req.body.origin,
        destination: req.body.destination,
        paymentMethod: req.body.paymentMethod,
        paymentStatus: req.body.paymentStatus,
        cordinates: req.body.cordinates,
      });
      handleResponse(res, 201, newRide);
    } else {
      next(new AppError("User with rider ID not found", 404));
    }
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

// Function for retrieving a ride
exports.getRide = catchAsync(async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.query.id)
      .populate("user", "name phone") // Populate the user field with username and email
      .populate({
        path: "rider",
        populate: {
          path: "user",
          select: "name phone", // You can specify the fields to include from the userSchema
        },
      }); // Populate the rider field;
    if (!ride) {
      return next(new AppError("Ride not found", 404));
    }
    handleResponse(res, 200, ride);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});

// Function for updating a ride
exports.updateRide = catchAsync(async (req, res, next) => {
  try {
    const updatedRide = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedRide) {
      return next(new AppError("Ride not found", 404));
    }
    handleResponse(res, 200, updatedRide);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

// Function for deleting a ride
exports.deleteRide = catchAsync(async (req, res, next) => {
  try {
    const deletedRide = await Ride.findByIdAndDelete(req.params.id);
    if (!deletedRide) {
      return next(new AppError("Ride not found", 404));
    }
    handleResponse(res, 204, null); // 204 No Content status for successful deletion
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});
