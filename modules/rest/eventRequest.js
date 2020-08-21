const {slotbotServerUrl} = require('../../config.json');
const fetch = require("node-fetch");
const eventUrl = `${slotbotServerUrl}/events`;

module.exports = {
    putChannelIdsRequest: async function (event_id, channel_ids) {
        return await fetch(`${eventUrl}/${event_id}/msgIds`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: channel_ids
        });
    },

    postEventRequest: async function (event) {
        return await fetch(`${eventUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: event
        });
    }
}
