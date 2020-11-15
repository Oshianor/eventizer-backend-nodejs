const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const { Auth } = require("../middlewares/auth")

// Create a new user
router.post("/", controller.user.create);
// get user details
router.get("/", Auth, controller.user.me)


module.exports = router;