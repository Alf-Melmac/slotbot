const {slotbotServerUrl} = require('../../config.json');
const fetch = require("node-fetch");

module.exports = {
    putChannelIdsRequest: async function (event_id, channel_ids) {
        return await fetch(`${slotbotServerUrl}/events/${event_id}/msgIds`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: channel_ids
        });
    },

    postEventRequest: async function (event) {
        return await fetch(`${slotbotServerUrl}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: event
        });
    },

    getEventByChannelRequest: async function (event_channel) {
        return await fetch(`${slotbotServerUrl}/events/channel/${event_channel}`, {
            method: 'GET'
        });
    },

    //Slotting
    postSlotRequest: async function (event_channel, slot_number, userId) {
        return await fetch(`${slotbotServerUrl}/events/channel/${event_channel}/slot/${slot_number}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userId
        });
    },

    postUnslotRequest: async function (event_channel, userId) {
        return await fetch(`${slotbotServerUrl}/events/channel/${event_channel}/unslot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userId
        });
    },

    //Editing
    postAddSlot: async function (event_channel, slot, squadNumber) {
        return await fetch(`${slotbotServerUrl}/events/channel/${event_channel}/addSlot/${squadNumber}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: slot
        });
    },

    deleteSlot: async function (event_channel, slotNumber) {
        return await fetch(`${slotbotServerUrl}/events/channel/${event_channel}/delSlot/${slotNumber}`, {
            method: 'DELETE'
        });
    }
}
