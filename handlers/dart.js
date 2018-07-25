const { toJson } = require('xml2json');

const {
  utils: { request, findStop }, constructors: { GetStops, Nearby }, validators: { checkServices },
} = require('../helpers');
const { dart } = require('../data');

exports.getStops = async (req, res, next) => GetStops(res, next, dart);

exports.getStop = async ({ params: { id } }, res, next) => {
  findStop(dart, id)
    .then(({ name }) => request(`http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=${name}`))
    .then(data => toJson(data))
    .then(data => JSON.parse(data))
    .then(({ ArrayOfObjStationData: { objStationData } }) => objStationData)
    .then(checkServices)
    .then(data => data.map(({
      Destination, Lastlocation, Duein, Traintype, Direction, Stationfullname,
    }) => ({
      destination: Destination,
      location: typeof Lastlocation === 'object' ? 'Depot' : Lastlocation,
      due: +Duein,
      type: Traintype,
      direction: Direction,
      stationName: Stationfullname,
    })))
    .then(data => data.filter(({ destination, stationName }) => destination !== stationName))
    .then(data => data.map(({ stationName, ...rest }) => rest))
    .then(data => data.sort((a, b) => a.due - b.due))
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
};

exports.nearby = (req, res, next) => Nearby(req, res, next, dart);
