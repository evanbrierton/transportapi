const { utils: { request } } = require('../helpers');

const services = ['dart', 'luas', 'bus'];

const nearby = (req, res, next) => {
  new Promise(resolve => resolve(services))
    .then(data => Promise.all(data.map(service => request(`http://localhost:3000/api/${service}/stops/nearby`))))
    .then(data => data.map((stops, i) => ({ service: services[i], stops })))
    .then(data => data.filter(({ stops: [stops] }) => stops))
    .then(data => res.send(data))
    .catch(err => next(err));
};

module.exports = nearby;
