const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const { Auth } = require("../middlewares/auth")

// Create an event
router.post("/", Auth, controller.event.create);

router.get("/", controller.event.all);


module.exports = router;