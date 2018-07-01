const http = require('http');

const request = (url, method = 'GET', options = {}) => (
  new Promise((resolve, reject) => {
    const {
      protocol, hostname, port, pathname, searchParams,
    } = new URL(url);
    const req = http.request({
      ...{
        method, protocol, hostname, port, path: `${pathname}?${searchParams}`,
      },
      ...options,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => resolve(data));
    }).end();

    req.on('error', err => reject(err));
  })
);

module.exports = request;
