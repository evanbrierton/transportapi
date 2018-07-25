const errorHandler = async ({ status, message }, req, res, next) => (
  next(res.status(status || 500).json({
    error: { message: message || 'Something went wrong.' },
  }))
);

module.exports = errorHandler;
