const errorHandler = ({ status = 500, message = 'Something went wrong.' }, req, res, next) => (
  next(res.status(status).json({ error: { message, status } }))
);

module.exports = errorHandler;
