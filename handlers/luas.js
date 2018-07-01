const { convert } = require('tabletojson');

const request = require('../helpers');

exports.getStops = async (req, res, next) => {
  request('http://luasforecasts.rpa.ie/analysis/view.aspx')
    .then(data => data.slice(data.indexOf('<option'), data.lastIndexOf('<option')))
    .then(data => data.split('/option'))
    .then(data => data.map(stop => stop.slice(stop.lastIndexOf('>') + 1, stop.lastIndexOf('<'))))
    .then(data => data.map(stop => stop.replace('&#39;', '\'')))
    .then(data => data.map(stop => stop.replace('&#225;', 'á')))
    .then(data => data.map(stop => stop.split(' - ')))
    .then(data => data.map(([number, code, name]) => ({ number, name, code })))
    .then(data => data.filter(({ name }) => name))
    .then(data => data.sort((a, b) => a.number - b.number))
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
};

exports.getStop = async ({ params: { id } }, res, next) => {
  request('http://localhost:3000/api/luas/stops')
    .then(data => JSON.parse(data))
    .then(data => data.filter(stop => Object.values(stop).includes(id)))
    .then(({ number }) => {
      request(`http://luasforecasts.rpa.ie/analysis/view.aspx?id=${number}`)
        .then(data => convert(data))
        .then(data => data[0])
        .then(data => data.map(({ Direction, Destination, AVLSTime }) => ({
          direction: Direction, destination: Destination, time: AVLSTime,
        })))
        .then(data => res.status(200).json(data))
        .catch(err => next(err));
    })
    .catch(err => next(err));
};
