const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const { Auth } = require("../middlewares/auth");

// create admin account
router.post("/", controller.admin.create);

router.post("/login", controller.auth.adminLogin);

// create category
router.post("/category", Auth, controller.admin.category);
// login admin
router.get("/state", controller.admin.state);


module.exports = router;