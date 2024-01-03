const db = require("../../config/db");
const { validationResult } = require("express-validator");
const ExceptionHandler = require("../../config/exceptions/operational_handler");
const async_exception_handler = require("../../config/exceptions/non_operational_handler");

const post = {
  index: async_exception_handler(async (req, res, next) => {
    // data = true;
    // if (data) {
    //   const err = new ExceptionHandler("data not found");
    //   err.statusCode = 404;
    //   err.status = "fail";
    //   return next(err);
    // }
    const [rows, fields] = await db.query("select text from posts limit 1000");
    res.json({
      data: rows,
    });
  }),
  show: async_exception_handler(async (req, res, next) => {
    const { id } = req.params;
    const [rows, fields] = await db.query("select * from posts where id = ?", [
      id,
    ]);

    if (Object.keys(rows).length == 0) {
      const error = new ExceptionHandler(
        "posts with that ID is not found!",
        404
      );

      console.log(error);
      return next(error);
    }
    res.json({
      data: rows,
    });
  }),
  save: async_exception_handler(async (req, res) => {
    const errors = validationResult(req);

    // if there is error then return Error
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    const { text, comment, images, user_id } = req.body;
    const insert =
      "insert into posts (text,comment,images,user_id) values (?,?,?,?)";
    const { rows, fields } = await db.query(insert, [
      text,
      comment,
      images,
      user_id,
    ]);
    res.json({
      message: "post created!!!",
    });
  }),
  update: async (req, res) => {
    try {
      const { text } = req.body;
      const { id } = req.params;
      const update = "update posts set text = ? where id = ?";
      const { rows, fields } = await db.query(update, [text, id]);
      res.json({
        data: rows,
      });
    } catch (error) {
      console.log(error);
    }
  },
  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const sql = "delete from posts where id = ?";
      const { rows, fields } = await db.query(sql, [id]);
      res.json({
        message: "post deleted!!!",
      });
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = post;
