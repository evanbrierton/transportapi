const fs = require('fs');

const { utils: { request } } = require('../helpers');

module.exports = async (next) => {
  request('http://data.dublinked.ie/cgi-bin/rtpi/busstopinformation')
    .then(({ results }) => results.filter(({
      operators, displaystopid,
    }) => displaystopid && operators.find(({ name }) => name === 'bac' || name === 'GAD')))
    .then((data) => data.map(({
      displaystopid, fullname, latitude, longitude, operators,
    }) => ({
      id: +displaystopid,
      name: fullname,
      location: { latitude: +latitude, longitude: +longitude },
      routes: [...new Set(operators.reduce((acc, { routes }) => [...acc, ...routes], []))]
        .sort((a, b) => a.localeCompare(b, 'en', { numeric: true })),
      type: 'bus',
    })))
    .then((data) => fs.writeFile('data/bus.json', JSON.stringify(data), (err) => (err && next(err))))
    .catch((err) => next(err));
};
