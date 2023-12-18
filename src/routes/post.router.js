const express = require("express");
const router = express.Router();
//post Contoller object
const post_controller = require("../controllers/post.controller");
//post validation Middlware
const post_validator = require("../validation/post.vavlidation");
//check JWT Token Middlware
const check_auth = require("./../middleware/auth/check_auth.middleware");
// Caching Config
const cache = require("../../config/resp_cache");

router.get("/", post_controller.index);
router.get("/:id", post_controller.show);
router.post("/", post_validator, check_auth, post_controller.save);
router.put("/:id", post_controller.update);
router.delete("/:id", post_controller.destroy);

module.exports = router;
