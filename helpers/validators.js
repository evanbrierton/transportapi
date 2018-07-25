const Validator = (message, func = data => data) => (
  data => new Promise((resolve, reject) => (func(data) ? resolve(data) : reject(Error(message))))
);

exports.checkServices = Validator('There are no services running at this time.');
exports.checkStops = Validator('No Stops Found.');
exports.checkResults = Validator('No Stops Found Nearby', data => data[0] && data[0][0]);

exports.Validator = Validator;
