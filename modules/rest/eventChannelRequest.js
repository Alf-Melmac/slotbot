const {slotbotServerUrl} = require('../../config.json');
const eventChannelUrl = `${slotbotServerUrl}/slotbot/api/events/channel`;
const Request = require('../../helper/request');

module.exports = {
    getEventByChannelRequest: (event_channel) => Request.GET(`${eventChannelUrl}/${event_channel}`),

    deleteEvent: (event_channel) => Request.DELETE(`${eventChannelUrl}/${event_channel}`),

    //Slotting
    postSlotRequest: (event_channel, slot_number, user) => Request.POST(`${eventChannelUrl}/${event_channel}/slot/${slot_number}`, user),

    postUnslotRequest: (event_channel, user) => Request.POST(`${eventChannelUrl}/${event_channel}/unslot`, user),

    postUnslotSlotRequest: (event_channel, slotNumber) => Request.POST(`${eventChannelUrl}/${event_channel}/unslot/${slotNumber}`),

    getSwapSlotsByUser: (event_channel, user, requester) => Request.PUT(`${eventChannelUrl}/${event_channel}/prepareSwap`, [user, requester]),

    getSwapSlots: (event_channel, slotNumber, user) => Request.PUT(`${eventChannelUrl}/${event_channel}/prepareSwap/${slotNumber}`, user),

    putBlockSlot: (event_channel, slotNumber, replacementName) => Request.PUT(`${eventChannelUrl}/${event_channel}/blockSlot/${slotNumber}`, replacementName),

    //Editing
    postAddSlot: (event_channel, slot, squadNumber) => Request.POST(`${eventChannelUrl}/${event_channel}/addSlot/${squadNumber}`, slot),

    deleteSlot: (event_channel, slotNumber) => Request.DELETE(`${eventChannelUrl}/${event_channel}/delSlot/${slotNumber}`),

    renameSlot: (event_channel, slotNumber, slotName) => Request.PUT(`${eventChannelUrl}/${event_channel}/renameSlot/${slotNumber}`, slotName)
}