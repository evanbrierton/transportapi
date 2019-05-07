const bus = require('./bus');
const luas = require('./luas');
const dart = require('./dart');

module.exports = () => Promise.all([bus(), luas(), dart()]);
