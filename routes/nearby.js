const { Router } = require('express');

const { nearby } = require('../handlers');

const router = Router({ mergeParams: true });

router.get('/', nearby);

module.exports = router;
