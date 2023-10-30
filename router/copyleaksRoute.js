let express = require("express");

let router = express.Router();

const copyleaksController = require("../controller/copyleaksController");

// Define the route for making the POST request
router.get("/login", copyleaksController.loginToCopyleaks);
router.post("/submit", copyleaksController.submitFileScan);
router.post("/scan", copyleaksController.startScan);
router.post("/webhook/completed/:id", copyleaksController.completedScan);
router.post("/webhook/error/:id", copyleaksController.errorScan);
router.post("/webhook/creditsChecked/:id", copyleaksController.creditsChecked);

module.exports = router;
