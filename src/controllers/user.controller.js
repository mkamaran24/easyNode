const db = require("../../config/db");
const { validationResult } = require("express-validator");
const ExceptionHandler = require("../../config/exceptions/operational_handler");
const async_exception_handler = require("../../config/exceptions/non_operational_handler");

const user = {
  index: async_exception_handler(async (req, res, next) => {
    const [rows, fields] = await db.query(
      "select users.ID,users.name,users.password, posts.ID, posts.text from users INNER JOIN posts ON users.ID = posts.user_id"
    );

    res.json({
      data: rows,
    });
  }),
  show: async_exception_handler(async (req, res, next) => {}),
  save: async_exception_handler(async (req, res) => {}),
  update: async (req, res) => {},
  destroy: async (req, res) => {},
};

module.exports = user;
