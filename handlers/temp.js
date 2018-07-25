
// exports.getStops = async (req, res, next) => {
//   request('http://data.dublinked.ie/cgi-bin/rtpi/busstopinformation')
//     .then(({ results }) => results.map(({
//       displaystopid, fullname, latitude, longitude, operators,
//     }) => ({
//       id: +displaystopid,
//       name: fullname,
//       operators,
//       location: { latitude: +latitude, longitude: +longitude },
//     })))
//     .then(data => data.filter(({ id }) => id))
//     .then(data => GetStops(res, next, data))
//     .catch(err => next(err));
// };
