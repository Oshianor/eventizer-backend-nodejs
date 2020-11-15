const express = require("express");
const router = express.Router();
const controller = require("../controllers");

// login as a user
router.post("/", controller.auth.login);
// verify a user account
router.post("/verify", controller.auth.verify);


module.exports = router;