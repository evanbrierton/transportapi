const { Router } = require('express');

const Route = ({ getStops, nearby, getStop }) => {
  const router = Router({ mergeParams: true });

  router.get('/', getStops);
  router.all('/nearby', nearby);
  router.get('/:id', getStop);

  return router;
};

module.exports = Route;
