require('dotenv').config();

const express = require('express');

const { errorHandler } = require('./handlers');
const {
  luasRoutes, dartRoutes, busRoutes, nearbyRoute,
} = require('./routes');

const app = express();

const { PORT } = process.env;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/luas/stops', luasRoutes);
app.use('/api/dart/stops', dartRoutes);
app.use('/api/bus/stops', busRoutes);
app.use('/api/nearby', nearbyRoute);

app.use((req, res, next) => {
  const err = Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => console.info(`Server Started on port ${PORT}`));
