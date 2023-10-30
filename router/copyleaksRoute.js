let express = require("express");

let router = express.Router();

const copyleaksController = require("../controller/copyleaksController");

// Define the route for making the POST request
router.get("/login", copyleaksController.loginToCopyleaks);
router.put("/submit", copyleaksController.submitFileScan);
router.put("/scan", copyleaksController.startScan);
router.put(
  "/webhook/completed/{STATUS}/:id",
  copyleaksController.completedScan
);
router.put("/webhook/error/{STATUS}/:id", copyleaksController.errorScan);
router.put(
  "/webhook/creditsChecked/{STATUS}/:id",
  copyleaksController.creditsChecked
);

module.exports = router;
