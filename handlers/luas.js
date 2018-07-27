const { convert } = require('tabletojson');

const { Service, utils: { request }, validators: { checkServices } } = require('../helpers');
const { luasData } = require('../data');

const luas = new Service(luasData);

exports.getStops = async (req, res, next) => luas.getStops(res, next);

exports.nearby = async ({ body: { location } }, res, next) => (
  luas.getNearby(location)
    .then(data => res.status(200).json(data))
    .catch(err => next(err))
);


exports.getStop = async ({ params: { id } }, res, next) => {
  luas.findStop(id)
    .then(data => request(`https://luasforecasts.rpa.ie/analysis/view.aspx?id=${data.id}`))
    .then(data => convert(data)[0])
    .then(checkServices)
    .then(data => (
      data.map(({ Direction, Destination, AVLSTime }) => ({
        direction: Direction, destination: Destination, due: +AVLSTime.split(':')[1],
      }))
    ))
    .then(data => data.filter(({ direction }) => direction !== 'Terminating'))
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
};
