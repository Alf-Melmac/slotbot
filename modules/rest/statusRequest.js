const {slotbotServerUrl} = require('../../config.json');
const fetch = require("node-fetch");

module.exports = {
    getPingRequest: async function () {
        return await fetch(`${slotbotServerUrl}/status`, {
            method: 'GET'
        });
    }
}
