const {slotbotServerUrl} = require('../../config.json');
const eventUrl = `${slotbotServerUrl}/slotbot/api/events`;
const Request = require('../../helper/request');

module.exports = {
    putEventUpdateRequest: (event_id, event) => Request.PUT(`${eventUrl}/${event_id}`, event),

    postEventRequest: (event) => Request.POST(`${eventUrl}`, event)
}
