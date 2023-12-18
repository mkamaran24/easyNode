const { body } = require("express-validator");

const login_validator = [
  body("email").isEmail().withMessage("should valid email!"),
  body("password").isLength({ min: 6 }).withMessage("should be greater than 6"),
];

module.exports = login_validator;
