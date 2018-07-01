require('dotenv').config();

const express = require('express');

const { errorHandler } = require('./handlers');

const { luasRoutes } = require('./routes');
const { dartRoutes } = require('./routes');

const app = express();

const { PORT } = process.env;

app.use('/api/luas', luasRoutes);
app.use('/api/dart', dartRoutes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => console.info(`Server Started on port ${PORT}`));
