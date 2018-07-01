const express = require('express');

const { luas: { getStops, getStop } } = require('../handlers');

const router = express.Router({ mergeParams: true });

router.get('/stop/:id', getStop);

router.get('/stops', getStops);

module.exports = router;
