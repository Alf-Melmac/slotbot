const apiTokenName = require('../config.json').apiTokenName || 'slotbot-authorization';
const {apiToken} = require('../config.json');

module.exports.authenticate = (req, res, next) => {
    const apiTokenReceived = req.headers[apiTokenName];
    if (apiTokenReceived) {
        if (apiToken === apiTokenReceived) {
            next();
        } else {
            logger.debug(`Request with token ${apiTokenReceived} denied.`)
            return res.sendStatus(403);
        }
    } else {
        res.sendStatus(401);
    }
};