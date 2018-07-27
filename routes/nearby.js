const { Router } = require('express');

const { nearby } = require('../handlers');

const router = Router({ mergeParams: true });

router.post('/', nearby);

module.exports = router;
