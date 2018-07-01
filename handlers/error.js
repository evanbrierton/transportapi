const errorHandler = (err, req, res, next) => {
  const { status, message } = err;
  return next(res.status(status || 500).json({
    error: { message: message || 'Something went wrong.' },
  }));
};

module.exports = errorHandler;
