const { convert } = require('tabletojson');

const { utils: { request, findStop }, validators: { checkServices } } = require('../helpers');
const { luas } = require('../data');


exports.getStops = async (req, res, next) => {
  try {
    res.status(200).json(luas);
  } catch (err) {
    next(err);
  }
};

exports.getStop = async ({ params: { id } }, res, next) => {
  findStop('luas', id)
    .then(data => request(`https://luasforecasts.rpa.ie/analysis/view.aspx?id=${data.id}`))
    .then(data => convert(data)[0])
    .then(checkServices)
    .then(data => (
      data.map(({ Direction, Destination, AVLSTime }) => ({
        direction: Direction, destination: Destination, time: AVLSTime,
      }))
    ))
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
};
