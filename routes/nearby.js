const { Router } = require('express');

const { nearby } = require('../handlers');

const router = Router({ mergeParams: true });

router.all('/', nearby);

module.exports = router;
