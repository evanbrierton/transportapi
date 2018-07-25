const axios = require('axios');

const { checkStops } = require('./validators');

exports.request = async (url, method = 'get', options) => (
  axios[method](url, options).then(({ data }) => data)
);

exports.chunk = (arr, chunkSize) => (
  Array(Math.ceil(arr.length / chunkSize)).fill().map((item, i) => (
    arr.slice(i * chunkSize, i * chunkSize + chunkSize)
  ))
);

exports.findStop = async (service, id) => (
  new Promise((resolve, reject) => {
    new Promise(res => res(service))
      .then(data => data.find(({ code }) => code === id.toUpperCase()))
      .then(checkStops)
      .then(data => resolve(data))
      .catch(err => reject(err));
  })
);

exports.calcDistance = (loc1, loc2) => {
  const toRadians = num => num * (Math.PI / 180);

  const φ1 = toRadians(loc1.latitude);
  const φ2 = toRadians(loc2.latitude);
  const δλ = toRadians(loc2.longitude - loc1.longitude);

  const a = (Math.sin((φ1 - φ2) / 2) ** 2)
            + Math.cos(φ1) * Math.cos(φ2)
            * (Math.sin(δλ / 2) ** 2);

  return Math.round(6371e3 * 2 * Math.atan(Math.sqrt(a), Math.sqrt(1 - a)));
};
