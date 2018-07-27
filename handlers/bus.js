const { Service, utils: { request }, validators: { checkServices } } = require('../helpers');
const { busData } = require('../data');

const bus = new Service(busData);

exports.getStops = async (req, res, next) => bus.getStops(res, next);

exports.nearby = async ({ body: { location } }, res, next) => (
  bus.getNearby(location)
    .then(data => res.status(200).json(data))
    .catch(err => next(err))
);

exports.getStop = async ({ params: { id } }, res, next) => {
  request(`https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=${id}`)
    .then((data) => {
      const { errorcode, errormessage } = data;
      if (+errorcode <= 1) return data;
      throw Error(errormessage);
    })
    .then(({ results }) => results.map(({
      duetime, destination, operator, route,
    }) => ({
      due: duetime, destination, operator, route,
    })))
    .then(data => (data[1] ? data : null))
    .then(checkServices)
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
};
