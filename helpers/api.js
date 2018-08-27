const { chunk, request } = require('./utils');

exports.openRouteServiceAPICall = (response, origin) => (
  Promise.resolve(response)
    .then(data => data.map(({ location: { longitude, latitude } }) => [longitude, latitude]))
    .then(data => chunk(data, 24))
    .then(data => data.map(item => [[origin.longitude, origin.latitude], ...item]))
    .then(data => data.map(locations => ({ locations, sources: '0', profile: 'foot-walking' })))
    .then(data => Promise.all(data.map(item => (request(
      `https://api.openrouteservice.org/matrix?api_key=${process.env.OPEN_ROUTE_API_KEY}&profile=foot-walking`,
      'post',
      item,
    )))))
    .then(data => data.map(({ durations: [durations] }) => durations))
    .then(data => data.reduce((acc, next) => [...acc, ...next]))
    .then(data => data.filter(value => value !== 0))
    .then(data => data.map((duration, i) => ({ ...response[i], distance: duration })))
    .catch(err => Promise.reject(err))
);
