const { convert } = require('tabletojson');

const { utils: { request, findStop }, constructors: { GetStops, Nearby }, validators: { checkServices } } = require('../helpers');
const { luas } = require('../data');

exports.getStops = async (req, res, next) => GetStops(res, next, luas);

exports.getStop = async ({ params: { id } }, res, next) => {
  findStop(luas, id)
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

exports.nearby = (req, res, next) => Nearby(req, res, next, luas);
