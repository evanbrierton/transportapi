const express = require('express');

const { luas: { getStops, getStop } } = require('../handlers');

const router = express.Router({ mergeParams: true });

router.get('/stops', getStops);
router.get('/stops/:id', getStop);

module.exports = router;
