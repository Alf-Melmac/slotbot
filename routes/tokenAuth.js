const express = require('express');
const router = express.Router();
const tokenAuthFilter = require('../helper/tokenAuthFilter');

router.all('*', tokenAuthFilter.authenticate, function(req, res, next) {
    next();
});

module.exports = router;