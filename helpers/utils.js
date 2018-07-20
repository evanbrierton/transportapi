const axios = require('axios');

const { checkStops } = require('./validators');

exports.GetStops = async (req, res, next, service) => async () => {
  try {
    res.status(200).json(service);
  } catch (err) {
    next(err);
  }
};

exports.request = async (url, method = 'get', options) => (
  axios[method](url, options).then(({ data }) => data)
);

exports.findStop = async (service, id) => (
  new Promise((resolve, reject) => {
    axios.get(`http://localhost:3000/api/${service}/stops`)
      .then(({ data }) => data)
      .then(data => data.find(({ code }) => code === id.toUpperCase()))
      .then(checkStops)
      .then(data => resolve(data))
      .catch(err => reject(err));
  })
);
