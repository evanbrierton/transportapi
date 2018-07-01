const express = require('express');

const { dart: { getStops, getStop } } = require('../handlers');

const router = express.Router({ mergeParams: true });

router.get('/stops', getStops);
router.get('/stop/:id', getStop);

module.exports = router;
