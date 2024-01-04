const express = require("express");
const router = express.Router();
//post Contoller object
const user_controller = require("../controllers/user.controller");
//check JWT Token Middlware
// const check_auth = require("./../middleware/auth/check_auth.middleware");
// Caching Config
// const cache = require("../../config/resp_cache");

router.get("/", user_controller.index);
// router.get("/:id", post_controller.show);
// router.post("/", post_validator, check_auth, post_controller.save);
// router.put("/:id", post_controller.update);
// router.delete("/:id", post_controller.destroy);

module.exports = router;
