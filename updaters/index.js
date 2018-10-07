const bus = require('./bus');
const luas = require('./luas');
const dart = require('./dart');

module.exports = () => {
  bus();
  luas();
  dart();
};
