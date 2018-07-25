require('dotenv').config();

const express = require('express');

const { errorHandler } = require('./handlers');
const {
  luasRoutes, dartRoutes, busRoutes, nearbyRoute,
} = require('./routes');

const app = express();

const { PORT } = process.env;

app.use('/api/luas', luasRoutes);
app.use('/api/dart', dartRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/nearby', nearbyRoute);

app.use((req, res, next) => {
  const err = Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => console.info(`Server Started on port ${PORT}`));
