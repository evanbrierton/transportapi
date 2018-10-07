const fs = require('fs');

const { utils: { request } } = require('../helpers');

module.exports = async (req, res, next) => {
  request('http://data.dublinked.ie/cgi-bin/rtpi/busstopinformation')
    .then(({ results }) => results.filter(({
      operators, displaystopid,
    }) => displaystopid && operators.find(({ name }) => name === 'bac')))
    .then(data => data.map(({
      displaystopid, fullname, latitude, longitude, operators: [{ routes }],
    }) => ({
      id: +displaystopid,
      name: fullname,
      location: { latitude: +latitude, longitude: +longitude },
      routes,
    })))
    .then(data => fs.writeFile('data/bus.json', JSON.stringify(data), err => (err && next(err))))
    .catch(err => next(err));
};
