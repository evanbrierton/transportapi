const { bus, luas, dart } = require('../handlers');
const { Route } = require('../helpers');

exports.nearbyRoute = require('./nearby');

exports.luasRoutes = Route(luas);
exports.dartRoutes = Route(dart);
exports.busRoutes = Route(bus);
