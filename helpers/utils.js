const axios = require('axios');

exports.request = async (url, method = 'get', options) => (
  axios[method](url, options).then(({ data }) => data)
);

exports.chunk = (arr, chunkSize = 64) => (
  Array(Math.ceil(arr.length / chunkSize)).fill().map((item, i) => (
    arr.slice(i * chunkSize, i * chunkSize + chunkSize)
  ))
);

exports.calcDistance = (origin, destination) => {
  const toRadians = num => num * (Math.PI / 180);

  const φ1 = toRadians(origin.latitude);
  const φ2 = toRadians(destination.latitude);
  const δλ = toRadians(destination.longitude - origin.longitude);

  const a = (Math.sin((φ1 - φ2) / 2) ** 2)
            + Math.cos(φ1) * Math.cos(φ2)
            * (Math.sin(δλ / 2) ** 2);

  return Math.round(6371e3 * 2 * Math.atan(Math.sqrt(a), Math.sqrt(1 - a)));
};
