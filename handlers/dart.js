const { toJson } = require('xml2json');
const request = require('../helpers');

exports.getStops = async (req, res, next) => {
  request('http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML_WithStationType?StationType=D')
    .then(data => toJson(data))
    .then(data => JSON.parse(data))
    .then(({ ArrayOfObjStation: { objStation } }) => objStation)
    .then(data => data.map(({
      StationDesc, StationAlias, StationLatitude, StationLongitude, StationCode, StationId,
    }) => ({
      name: StationDesc,
      alias: typeof StationAlias === 'object' ? undefined : StationAlias,
      location: { latitude: StationLatitude, longitude: StationLongitude },
      code: StationCode,
      id: StationId,
    })))
    .then(data => data.map((stop) => {
      if (stop.alias && stop.alias.includes(' ')) {
        const { alias } = stop;
        return { ...stop, alias: alias.slice(0, alias.indexOf(' ')) };
      }
      return stop;
    }))
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
};

exports.getStop = async ({ params: { id } }, res, next) => {
  request('http://localhost:3000/api/dart/stops')
    .then(data => JSON.parse(data))
    .then(data => data.filter(stop => Object.values(stop).includes(id)))
    .then(data => data[0])
    .then(({ name }) => {
      request(`http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=${name}`)
        .then(data => toJson(data))
        .then(data => JSON.parse(data))
        .then(({ ArrayOfObjStationData: { objStationData } }) => objStationData)
        .then(data => data.map(({
          Destination, Lastlocation, Duein, Traintype, Direction,
        }) => ({
          destination: Destination,
          location: typeof Lastlocation === 'object' ? 'Depot' : Lastlocation,
          due: Duein,
          type: Traintype,
          direction: Direction,
        })))
        .then(data => data.filter(({ destination }) => destination !== name))
        .then(data => data.sort((a, b) => a.due - b.due))
        .then(data => res.status(200).json(data))
        .catch(err => next(err));
    });
};
