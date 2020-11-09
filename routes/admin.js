const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");
const auth = require("../controllers/auth");
const { Auth } = require("../middlewares/auth");

// create admin account
router.post("/", admin.create.admin);
// create category
router.post("/category", Auth, admin.create.category);
// login admin
router.post("/login", auth.login.admin);


module.exports = router;