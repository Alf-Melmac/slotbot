const {slotbotServerUrl} = require('../../config.json');
const eventUrl = `${slotbotServerUrl}/events`;
const Request = require('../../helper/request');

module.exports = {
    putChannelIdsRequest: (event_id, channel_ids) => Request.PUT(`${eventUrl}/${event_id}`, channel_ids),

    postEventRequest: (event) => Request.POST(`${eventUrl}`, event)
}
