class Handler {
  async error(req, res, error, params, statusCode) {
    res.status(statusCode).json({
      flag: false,
      error: error.message,
      status: statusCode,
      url: req.url,
      params,
    });
    return;
  }

  async throwError(req, res, msg, statusCode) {
    const error = new Error(msg);
    error.status = statusCode;
    throw error;
  }

  LogInfo(req, res, msg, params) {
    console.log({
      url: req.url,
      logOutput: msg,
      params,
    });
  }
}

module.exports = { Handler };
