class ExceptionHandler extends Error {
  constructor(msg, status_code) {
    super(msg);
    this.statusCode = status_code;
    this.status =
      this.statusCode >= 400 && this.statusCode < 500 ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ExceptionHandler;
