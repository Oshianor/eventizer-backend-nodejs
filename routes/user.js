const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const { Auth } = require("../middlewares/auth")

// Create a new user
router.post("/", user.create.user);
// get user details
router.get("/", Auth, user.get.user)


module.exports = router;