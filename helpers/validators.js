const Validator = (message, func) => (
  data => new Promise((resolve, reject) => (func(data) ? resolve(data) : reject(Error(message))))
);

exports.checkServices = Validator('There are no services running at this time.', data => data);
exports.checkStops = Validator('No Stops Found.', data => data);
