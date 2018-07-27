const { request, calcDistance, chunk } = require('./utils');
const { checkStops, checkResults } = require('./validators');

module.exports = class Service {
  constructor(stops, name) {
    this.stops = stops;
    this.name = name;
  }

  getStops(res, next) {
    try {
      res.status(200).json(this.stops);
    } catch (err) {
      next(err);
    }
  }

  async findStop(id) {
    return new Promise((resolve, reject) => {
      Promise.resolve(this.stops)
        .then(stops => stops.find(({ code }) => code === id.toUpperCase()))
        .then(checkStops)
        .then(stop => resolve(stop))
        .catch(err => reject(err));
    });
  }

  isNearby(origin) {
    return this.stops.filter(({ location }) => calcDistance(origin, location) < 1260);
  }

  async getNearby(origin) {
    const baseURL = `https://maps.googleapis.com/maps/api/distancematrix/json?mode=walking&key=${process.env.DISTANCE_MATRIX_KEY}`;
    const nearbyStops = this.isNearby(origin);

    return new Promise((resolve, reject) => {
      if (nearbyStops[0]) {
        Promise.resolve(nearbyStops)
          .then(data => (
            data.reduce((acc, { location: { longitude, latitude } }) => (
              `${acc + latitude},${longitude}|`
            ), '')
          ))
          .then(data => data.split('|'))
          .then(data => chunk(data))
          .then(checkResults)
          .then(data => (
            Promise.all(data.map(coords => (
              request(
                `${baseURL}&origins=${origin.latitude},${origin.longitude}&destinations=${coords.join('|')}`,
              )
            )))
          ))
          .then(data => data.map(({ rows: [{ elements }] }) => elements))
          .then(data => data.reduce((acc, next) => acc.concat(next)))
          .then(data => (
            data.map(({ duration: { value } }, i) => (
              { ...nearbyStops[i], distance: value }
            ))
          ))
          .then(data => data.filter(({ distance }) => distance < 900))
          .then(data => data.sort((a, b) => a.distance - b.distance))
          .then(data => resolve(data))
          .catch(err => reject(err));
      } else {
        resolve(null);
      }
    });
  }
};
