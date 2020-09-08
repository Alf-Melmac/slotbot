const {slotbotServerUrl} = require('../../config.json');
const slotUrl = `${slotbotServerUrl}/slots`;
const Request = require('../../helper/request');

module.exports = {
    putSwapRequest: (slots) => Request.PUT(`${slotUrl}/swap`, slots)
}
