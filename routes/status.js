const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    logger.debug('ping');

    res.type('text/plain');
    res.status(200).send('Pong');
});

module.exports = router;