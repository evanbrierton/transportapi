const fs = require('fs');

const { utils: { request } } = require('../helpers');
const { luasData } = require('../data');

module.exports = async (req, res, next) => {
  request('http://luasforecasts.rpa.ie/analysis/view.aspx')
    .then(data => data.slice(data.indexOf('<option'), data.lastIndexOf('<option')))
    .then(data => data.split('/option'))
    .then(data => (
      data.map(
        stop => (
          stop.slice(
            stop.lastIndexOf('>') + 1,
            stop.lastIndexOf('<'),
          ).replace('&#39;', '\'').replace('&#225;', 'á').split(' - ')
        ),
      )
    ))
    .then(data => data.map(([number, code, name]) => ({ id: +number, name, code })))
    .then(data => data.filter(({ name }) => name))
    .then(data => data.sort((a, b) => a.id - b.id))
    // .then(data => data.map(item => ({
    //   ...item,
    //   location: luasData.find(({ name }) => name === item.name)
    //     ? luasData.find(({ name }) => name === item.name).location
    //     : null,
    //   type: 'luas',
    // })))
    .then(data => data.forEach(item => (
      request(`https://luas.ie/${item.name}.html`)
        .then(doc => doc.slice(doc.indexOf('jsan="7.place-name">'), doc.indexOf('</div>')))
        .then(text => console.log(text))
        .then(() => data)
    )))
    .then(data => data.map(item => ({ ...item, name: `${item.name} Luas` })))
    .then(data => fs.writeFile('data/luas.json', JSON.stringify(data), err => (err && next(err))))
    .catch(err => console.log(err));
};