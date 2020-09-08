const {slotbotServerUrl} = require('../../config.json');
const eventChannelUrl = `${slotbotServerUrl}/events/channel`;
const Request = require('../../helper/request');

module.exports = {
    getEventByChannelRequest: (event_channel) => Request.GET(`${eventChannelUrl}/${event_channel}`),

    //Slotting
    postSlotRequest: (event_channel, slot_number, user) => Request.POST(`${eventChannelUrl}/${event_channel}/slot/${slot_number}`, user),

    postUnslotRequest: (event_channel, user) => Request.POST(`${eventChannelUrl}/${event_channel}/unslot`, user),

    getSwapSlots: (event_channel, slotNumber, user) => Request.PUT(`${eventChannelUrl}/${event_channel}/prepareSwap/${slotNumber}`, user),

    //Editing
    postAddSlot: (event_channel, slot, squadNumber) => Request.POST(`${eventChannelUrl}/${event_channel}/addSlot/${squadNumber}`, slot),

    deleteSlot: (event_channel, slotNumber) => Request.DELETE(`${eventChannelUrl}/${event_channel}/delSlot/${slotNumber}`)
}
