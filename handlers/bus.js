const { Service, utils: { request } } = require('../helpers');
const { busData } = require('../data');

const bus = new Service(busData);

exports.getStops = async (req, res, next) => bus.getStops(res, next);

exports.nearby = async (req, res, next) => bus.nearby(req, res, next);

exports.getStop = async ({ params: { id } }, res, next) => {
  request(`https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=${id}`)
    .then((data) => {
      const { errorcode } = data;
      if (+errorcode === 1) next({ message: 'No Stops Found', status: 404 });
      if (+errorcode === 4) next({ message: 'Scheduled Downtime', status: 503 });
      if (+errorcode === 5) next({ message: 'System Error' });
      return data;
    })
    .then(({ results }) => results.map(({ duetime, destination, route }) => ({
      due: +duetime, destination, route,
    })))
    .then(data => (data[1] ? data : null))
    .then(data => (!data ? next({
      message: 'There are no services running at this time.', status: 404,
    }) : data))
    .then(data => data.sort((a, b) => a.due - b.due))
    .then(services => ({ ...busData.find(stop => +id === stop.id), services }))
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
};
