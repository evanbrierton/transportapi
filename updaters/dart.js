const fs = require('fs');
const { toJson } = require('xml2json');

const { utils: { request } } = require('../helpers');


module.exports = async (next) => {
  request('http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML_WithStationType?StationType=D')
    .then((data) => toJson(data))
    .then((data) => JSON.parse(data))
    .then(({ ArrayOfObjStation: { objStation } }) => objStation)
    .then((data) => data.map(({
      StationDesc, StationAlias, StationLatitude, StationLongitude, StationCode, StationId,
    }) => ({
      name: StationDesc,
      alias: typeof StationAlias === 'object' ? undefined : StationAlias,
      location: { latitude: StationLatitude, longitude: StationLongitude },
      code: StationCode,
      id: StationId,
    })))
    .then((data) => data.map((stop) => (
      stop.alias && stop.alias.includes(' ')
        ? { ...stop, alias: stop.alias.slice(0, stop.alias.indexOf(' ')) }
        : stop
    )))
    .then((data) => fs.writeFile('data/dart.json', JSON.stringify(data), (err) => (err && next(err))))
    .catch((err) => next(err));
};
