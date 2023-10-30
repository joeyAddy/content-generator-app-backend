let express = require("express");

let router = express.Router();

const copyleaksController = require("../controller/copyleaksController");

// Define the route for making the POST request
router.post("/login", copyleaksController.loginToCopyleaks);

module.exports = router;
