const { Router } = require('express');

const { luas: { getStops, getStop, nearby } } = require('../handlers');

const router = Router({ mergeParams: true });

router.get('/stops', getStops);
router.get('/stops/nearby', nearby);
router.get('/stops/:id', getStop);

module.exports = router;
