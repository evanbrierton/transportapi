const fs = require('fs');

const { utils: { request } } = require('../helpers');

const filter = results => results.filter(({
  operators, displaystopid,
}) => displaystopid && operators.find(({ name }) => name === 'bac' || name === 'GAD'));

const map = data => data.map(({
  displaystopid, fullname, latitude, longitude, operators,
}) => ({
  id: +displaystopid,
  name: fullname,
  location: { latitude: +latitude, longitude: +longitude },
  routes: [...new Set(operators.reduce((acc, { routes }) => [...acc, ...routes], []))]
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true })),
  type: 'bus',
}));

module.exports = next => (
  request('http://data.smartdublin.ie/cgi-bin/rtpi/busstopinformation')
    .then(({ results }) => filter(results))
    .then(map)
    .then(data => fs.writeFileSync('data/bus.json', JSON.stringify(data), err => (err && next(err))))
    .catch(err => console.log(err))
);
