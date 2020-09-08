const {slotbotServerUrl} = require('../../config.json');
const fetch = require("node-fetch");
const eventChannelUrl = `${slotbotServerUrl}/events/channel`;

module.exports = {
    getEventByChannelRequest: async function (event_channel) {
        return await fetch(`${eventChannelUrl}/${event_channel}`, {
            method: 'GET'
        });
    },

    //Slotting
    postSlotRequest: async function (event_channel, slot_number, user) {
        return await fetch(`${eventChannelUrl}/${event_channel}/slot/${slot_number}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    },

    postUnslotRequest: async function (event_channel, user) {
        return await fetch(`${eventChannelUrl}/${event_channel}/unslot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    },

    getSwapSlots: async function (event_channel, slotNumber, user) {
        return await fetch(`${eventChannelUrl}/${event_channel}/prepareSwap/${slotNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    },

    //Editing
    postAddSlot: async function (event_channel, slot, squadNumber) {
        return await fetch(`${eventChannelUrl}/${event_channel}/addSlot/${squadNumber}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: slot
        });
    },

    deleteSlot: async function (event_channel, slotNumber) {
        return await fetch(`${eventChannelUrl}/${event_channel}/delSlot/${slotNumber}`, {
            method: 'DELETE'
        });
    }
}
