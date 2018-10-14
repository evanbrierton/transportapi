const { calcDistance } = require('./utils');
const { openRouteServiceAPICall } = require('./api');

class Service {
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

  async findStop(queryId, next) {
    return new Promise((resolve, reject) => {
      Promise.resolve(this.stops)
        .then(stops => stops.find(({ id }) => id === +queryId))
        .then(data => (!data ? next({ status: 404, message: 'No Stops Found' }) : data))
        .then(stop => resolve(stop))
        .catch(err => reject(err));
    });
  }

  isNearby(origin) {
    return this.stops.map(stop => ({
      ...stop, distance: calcDistance(origin, stop.location),
    })).filter(({ distance }) => distance < 1260);
  }

  async getNearby(origin) {
    const nearbyStops = origin ? this.isNearby(origin) : [];
    return new Promise((resolve) => {
      Promise.resolve(nearbyStops)
        .then(data => (data[0] ? data : resolve(data)))
        .then(data => openRouteServiceAPICall(data, origin))
        .then(data => resolve(data))
        .catch(() => resolve(nearbyStops));
    });
  }

  async nearby({ method, body: { location } }, res, next) {
    return method !== 'POST' ? next({ status: 405, message: `Method Not Allowed: ${method}` })
      : this.getNearby(location)
        .then(data => data.sort((a, b) => a.distance - b.distance))
        .then(data => data.filter(({ distance }) => distance < 900))
        .then(data => res.status(200).json(data))
        .catch(err => next(err));
  }
}

module.exports = Service;
