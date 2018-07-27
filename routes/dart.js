const { Router } = require('express');

const { dart: { getStops, getStop, nearby } } = require('../handlers');

const router = Router({ mergeParams: true });

router.get('/', getStops);
router.post('/nearby', nearby);
router.get('/:id', getStop);

module.exports = router;
