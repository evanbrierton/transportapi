require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { errorHandler } = require('./handlers');
const { limiter } = require('./helpers');
const {
  luasRoutes, dartRoutes, busRoutes, nearbyRoute,
} = require('./routes');

const app = express();

const { PORT } = process.env;

app.use(express.static(`${__dirname}/static`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api/dart', limiter);

app.use('/api/luas/stops', luasRoutes);
app.use('/api/dart/stops', dartRoutes);
app.use('/api/bus/stops', busRoutes);
app.use('/api/nearby', nearbyRoute);

app.use((req, res, next) => next({ status: 404, message: 'Not Found' }));

app.get('/', (req, res) => res.sendFile('index'));

app.use(errorHandler);

app.listen(PORT || 3000, () => console.info(`Server Started on port ${PORT || 3000}`));
