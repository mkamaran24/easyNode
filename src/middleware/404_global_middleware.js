/*
    |--------------------------------------------------------------------------
    | 404 Error Handler 
    |--------------------------------------------------------------------------
    |
    | This middleware will be triggred while there is no defined routes found
    |
*/
const OperationalError = require("./../../config/exceptions/operational_handler");
module.exports = (req, res, next) => {
  const err = new OperationalError(`Cant find ${req.originalUrl} on server`);
  err.statusCode = 404;
  err.status = "fail";
  next(err);
};
