const express = require("express");
const router = express.Router();

const auth_controller = require("../controllers/auth.controller");
//validation middleware goes here
const register_validations = require("../validation/register.validation");
const login_validator = require("../validation/login.validation");

router.post("/login", login_validator, auth_controller.login);
router.post("/register", register_validations, auth_controller.register);

module.exports = router;
