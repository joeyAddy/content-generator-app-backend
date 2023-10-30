let mongoose = require("mongoose");
let bcrypt = require("bcryptjs");

let PlagiarismScanSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "pleasethe id of the scan file"],
    unique: true,
  },
  result: {
    type: Object,
    required: [true, "please the result of the scan"],
  },
});

let ScanResult = mongoose.model("ScanReuslt", PlagiarismScanSchema);

module.exports = ScanResult;
