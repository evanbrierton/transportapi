const { Service } = require('../helpers');
const { busData, luasData, dartData } = require('../data');

module.exports = async ({ body: { location } }, res, next) => {
  Promise.resolve([
    { stops: dartData, name: 'dart' },
    { stops: luasData, name: 'luas' },
    { stops: busData, name: 'bus' },
  ])
    .then(data => data.map(({ stops, name }) => new Service(stops, name)))
    .then(data => Promise.all(data.map(async service => ({
      name: service.name, service: await service.getNearby(location),
    }))))
    .then(data => data.filter(({ service }) => service && service[0]))
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
};
