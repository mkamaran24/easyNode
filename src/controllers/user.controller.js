const db = require("../../config/db");
const { validationResult } = require("express-validator");
const ExceptionHandler = require("../../config/exceptions/operational_handler");
const async_exception_handler = require("../../config/exceptions/non_operational_handler");
const user_collection = require("../resources/collection/user.collection");

const user = {
  index: async_exception_handler(async (req, res, next) => {
    const sql = `select users.ID as userID,
      users.name,
      users.password, 
      posts.ID as postID, 
      posts.text 
      from users 
      INNER JOIN posts ON users.ID = posts.user_id`;

    const [rows, fields] = await db.query(sql);

    user_collection(rows, res);
  }),
  show: async_exception_handler(async (req, res, next) => {}),
  save: async_exception_handler(async (req, res) => {}),
  update: async (req, res) => {},
  destroy: async (req, res) => {},
};

module.exports = user;
