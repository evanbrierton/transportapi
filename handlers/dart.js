const { toJson } = require('xml2json');

const { Service, utils: { request } } = require('../helpers');
const { dartData } = require('../data');

const dart = new Service(dartData);

exports.getStops = async (req, res, next) => dart.getStops(res, next);

exports.nearby = async (req, res, next) => dart.nearby(req, res, next);

exports.getStop = async ({ params: { id } }, res, next) => {
  dart.findStop(id, next)
    .then(({ name }) => request(`http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=${name}`))
    .then((data) => toJson(data))
    .then((data) => JSON.parse(data))
    .then(({ ArrayOfObjStationData: { objStationData } }) => objStationData)
    .then((data) => (!data ? ({
      message: 'There are no services running at this time.', status: 404,
    }) : data))
    .then((data) => data.map(({
      Destination, Lastlocation, Duein, Traintype, Direction, Stationfullname,
    }) => ({
      destination: Destination,
      location: typeof Lastlocation === 'object' ? 'Depot' : Lastlocation,
      due: +Duein,
      type: Traintype,
      direction: Direction,
      stationName: Stationfullname,
    })))
    .then((data) => data.filter(({ destination, stationName }) => destination !== stationName))
    .then((data) => data.map(({ stationName, ...rest }) => rest))
    .then((data) => data.sort((a, b) => a.due - b.due))
    .then((services) => ({ ...dartData.find(({ code }) => id.toUpperCase() === code), services }))
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err));
};
