const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");

// login as a user
router.post("/user", auth.login.user);
// login as a orgainzer
router.post("/organizer", auth.login.organizer);
// verify a user account
router.post("/verify", auth.verify.account);


module.exports = router;