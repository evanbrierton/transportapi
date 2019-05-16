const { Service, utils: { request, log } } = require('../helpers');
const { busData } = require('../data');

const bus = new Service(busData);

exports.getStops = async (req, res, next) => bus.getStops(res, next);

exports.nearby = async (req, res, next) => bus.nearby(req, res, next);

exports.getStop = async ({ params: { id } }, res, next) => {
  bus.findStop(id, next)
    .then(data => request(`https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=${data.id}`))
    .then(log)
    .then((data) => {
      const { errorcode } = data;
      if (+errorcode === 4) next({ message: 'Scheduled Downtime', status: 503 });
      if (+errorcode === 5) next({ message: 'System Error' });
      return data;
    })
    .then(({ results }) => results.map(({ duetime, destination, route }) => ({
      due: duetime === 'Due' ? 0 : +duetime, destination, route,
    })))
    .then(data => (data[0] ? data : ({
      message: 'There are no services running at this time.',
      status: 404,
    })))
    .then(data => (Array.isArray(data) ? data.sort((a, b) => a.due - b.due) : data))
    .then(services => ({ ...busData.find(stop => +id === stop.id), services }))
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
};
