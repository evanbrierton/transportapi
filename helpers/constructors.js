const { request, chunk, calcDistance } = require('./utils');
const { checkResults } = require('./validators');

exports.GetStops = async (res, next, service) => {
  try {
    res.status(200).json(service);
  } catch (err) {
    next(err);
  }
};

exports.Nearby = async (req, res, next, service) => {
  const { ORIGINLONGITUDE, ORIGINLATITUDE } = process.env;

  const origin = {
    longitude: ORIGINLONGITUDE,
    latitude: ORIGINLATITUDE,
  };

  const nearby = destinations => (
    destinations.filter(({ location }) => calcDistance(origin, location) < 2500)
  );

  new Promise(resolve => resolve(nearby(service)))
    .then(data => (
      data.reduce((acc, { location: { longitude, latitude } }) => (
        `${acc + latitude},${longitude}|`
      ), '')
    ))
    .then(data => data.split('|'))
    .then(data => chunk(data, 64))
    .then(checkResults)
    .then(data => Promise.all(data.map(ch => request(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=53.192958399999995,-6.118641900000057&destinations=${ch.join('|')}&mode=walking&key=${process.env.DISTANCE_MATRIX_KEY}`))))
    .then(data => data.map(({ rows: [{ elements }] }) => elements))
    .then(data => data.reduce((acc, nex) => acc.concat(nex)))
    .then(data => (
      data.map(({ duration: { value } }, i) => ({ ...nearby(service)[i], distance: value }))
    ))
    .then(data => data.filter(({ distance }) => distance < 900))
    .then(data => data.sort((a, b) => a.distance - b.distance))
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
};
