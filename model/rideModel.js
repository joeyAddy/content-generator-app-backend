const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  rideType: {
    type: String,
    required: true,
  },
  origin: {
    type: Object,
    required: true,
  },
  destination: {
    type: Object,
    required: true,
  },
  coordinates: {
    type: Object,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    default: "Cash",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "confirmed"],
    default: "pending",
  },
  status: {
    type: String,
    enum: ["available", "taken", "finished"],
    default: "available",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rider",
    default: "NIL",
  },
});

const Ride = mongoose.model("Ride", rideSchema);

module.exports = Ride;
