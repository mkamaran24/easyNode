const { body } = require("express-validator");

const register_validations = [
  body("email").isEmail().withMessage("please enter valid email!"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password lenght should be greater than 6"),
];

module.exports = register_validations;
