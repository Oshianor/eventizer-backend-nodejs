const express = require("express");
const router = express.Router();
const event = require("../controllers/event");
const { Auth } = require("../middlewares/auth")

// Create an event
router.post("/", Auth, event.create.event);


module.exports = router;