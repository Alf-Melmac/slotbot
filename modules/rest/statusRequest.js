const {slotbotServerUrl} = require('../../config.json');
const apiUrl = `${slotbotServerUrl}/slotbot/api`;
const Request = require('../../helper/request');

module.exports = {
    getPingRequest: () => Request.GET(`${apiUrl}/status`)
}
