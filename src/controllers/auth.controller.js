const db = require("../../config/db");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const auth = {
  login: (req, res) => {
    try {
      res.json({ mesage: "HI" });
    } catch (error) {}
  },
  register: async (req, res) => {
    try {
      const errors = validationResult(req);

      // if there is error then return Error
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }
      const { email, password } = req.body;
      let hashedPass = await bcrypt.hash(password, 10);
      res.json({ email: email, password: hashedPass });
    } catch (error) {
      res.json({ error: error });
    }
  },
};

module.exports = auth;
