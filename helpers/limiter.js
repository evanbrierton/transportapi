const RateLimit = require('express-rate-limit');

const limiter = new RateLimit({
  windowMS: 3600000,
  max: 120,
  delayMs: 0,
  handler: (req, res, next) => next({ status: 429, message: 'Too Many Requests' }),
  skip: ({ hostname, headers: { auth } }) => auth === process.env.KEY && hostname === 'localhost',
});

module.exports = limiter;
