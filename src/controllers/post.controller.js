const db = require("../../config/db");
const { validationResult } = require("express-validator");
const ExceptionHandler = require("../../config/exceptions/operational_handler");
const async_exception_handler = require("../../config/exceptions/non_operational_handler");

const post = {
  index: async_exception_handler(async (req, res, next) => {
    const sql = `SELECT
    posts.ID AS postID,
    posts.text,
    posts.comment,
    posts.images,
    posts.user_id,
    users.name,
    users.ID AS userID
FROM
    posts
INNER JOIN
    users ON users.ID = posts.user_id;
`;

    const [rows, fields] = await db.query(sql);
    console.log("DB.END");
    res.json({
      data: rows,
    });
  }),
  show: async_exception_handler(async (req, res, next) => {
    const { id } = req.params;
    const [rows, fields] = await db.query("select * from posts where id = ?", [
      id,
    ]);

    db.end();

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
  get_protocol: async(req,res){
    console.log("test_params");
  }
};

module.exports = post;
