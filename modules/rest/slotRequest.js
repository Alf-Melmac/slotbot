const {slotbotServerUrl} = require('../../config.json');
const fetch = require("node-fetch");
const slotUrl = `${slotbotServerUrl}/slots`;

module.exports = {
    putSwapRequest: async function (slots) {
        return await fetch(`${slotUrl}/swap`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: slots
        });
    }
}
