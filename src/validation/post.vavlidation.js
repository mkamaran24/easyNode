const { body } = require("express-validator");

const post_validator = [
  body("text").exists({ checkFalsy: true }).withMessage("reuired"),
  body("images").exists({ checkFalsy: true }).withMessage("reuired"),
];

console.log("validation here");

module.exports = post_validator;
