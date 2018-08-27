const { convert } = require('tabletojson');

const { Service, utils: { request } } = require('../helpers');
const { luasData } = require('../data');

const luas = new Service(luasData);

exports.getStops = async (req, res, next) => luas.getStops(res, next);

exports.nearby = async (req, res, next) => luas.nearby(req, res, next);

exports.getStop = async ({ params: { id } }, res, next) => {
  luas.findStop(id, next)
    .then(data => request(`https://luasforecasts.rpa.ie/analysis/view.aspx?id=${data.id}`))
    .then(data => convert(data)[0])
    .then(data => (!data ? ({
      message: 'There are no services running at this time.', status: 404,
    }) : data))
    .then(data => (
      data.map(({ Direction, Destination, AVLSTime }) => ({
        direction: Direction, destination: Destination, due: +AVLSTime.split(':')[1],
      }))
    ))
    .then(data => data.filter(({ direction }) => direction !== 'Terminating'))
    .then(data => data.sort((a, b) => a.due - b.due))
    .then(services => ({ ...luasData.find(({ code }) => id.toUpperCase() === code), services }))
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
};
