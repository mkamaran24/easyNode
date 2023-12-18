/*
    |--------------------------------------------------------------------------
    | Require Third Party
    |--------------------------------------------------------------------------
*/
const express = require("express");

/*
    |--------------------------------------------------------------------------
    | Require Applications Routes
    |--------------------------------------------------------------------------
*/
const post_router = require("./routes/post.router");
const auth_router = require("./routes/auth.router");

/*
    |--------------------------------------------------------------------------
    | Require Error Handlers
    |--------------------------------------------------------------------------
*/
const globla_err = require("./middleware/error_global_middleware");
const url_not_found_err = require("./middleware/404_global_middleware");

/*
    |--------------------------------------------------------------------------
    | The application's global HTTP
    |--------------------------------------------------------------------------
*/
let app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/*
    |--------------------------------------------------------------------------
    | Application Routes Definitions
    |--------------------------------------------------------------------------
*/
app.use("/api/posts", post_router);
app.use("/api/v1/auth", auth_router);

/*
    |--------------------------------------------------------------------------
    | Global Exception Middleware
    |--------------------------------------------------------------------------
*/
app.all("*", url_not_found_err);
app.use(globla_err);

/*
    |--------------------------------------------------------------------------
    | Export App
    |--------------------------------------------------------------------------
*/
module.exports = app;
