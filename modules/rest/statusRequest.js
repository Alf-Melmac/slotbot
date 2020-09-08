const {slotbotServerUrl} = require('../../config.json');
const Request = require('../../helper/request');

module.exports = {
    getPingRequest: () => Request.GET(`${slotbotServerUrl}/status`)
}
