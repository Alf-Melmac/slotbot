const Slot = require('../modules/slot');
const User = require('../modules/user');
const eventRequest = require("./rest/eventRequest");
const eventChannelRequest = require("./rest/eventChannelRequest");

class Event {
    constructor(url, name, date, startTime, creator, channel, squadList, infoMsg, slotListMsg, description, pictureUrl,
                missionTypeAndRespawn, missionLength, reserveParticipating, modPack, modPackUrl, map, missionTime,
                navigation, technicalTeleport, medicalSystem) {
        this.url = url;
        this.name = name;
        this.date = date;
        this.startTime = startTime;
        this.creator = creator;
        this.channel = channel;
        this.squadList = squadList;
        this.infoMsg = infoMsg;
        this.slotListMsg = slotListMsg;
        this.description = description;
        this.pictureUrl = pictureUrl;

        this.missionTypeAndRespawn = missionTypeAndRespawn;
        this.missionLength = missionLength;
        this.reserveParticipating = reserveParticipating;
        this.modPack = modPack;
        this.modPackUrl = modPackUrl;
        this.map = map;
        this.missionTime = missionTime;
        this.navigation = navigation;
        this.technicalTeleport = technicalTeleport;
        this.medicalSystem = medicalSystem;
    }

    static postEvent(message, event, callback) {
        eventRequest.postEventRequest(event)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => {
                logger.error(reason);
                MessageHelper.replyAndDelete(message, 'Des Event konnte nicht an den Server gesendet werden. Probiere es später erneut oder nutze den Wizard auf der Website.');
            });
    }

    static updateEvent(message, eventId, event, callback) {
        eventRequest.putEventUpdateRequest(eventId, event)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    static delEvent(message, callback) {
        eventChannelRequest.deleteEvent(message.channel.id)
            .then(callback)
            .catch(reason => requestErrorHandling(reason, message));
    }

    //Get Event
    static getEventByChannel(message, callback) {
        eventChannelRequest.getEventByChannelRequest(message.channel.id, callback)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    static getEventByChannelWithoutReply(messageClone, callback) {
        eventChannelRequest.getEventByChannelRequest(messageClone.channel.id, callback)
            .then(response => {
                if (response.ok) {
                    response.json().then(json => callback(json));
                }
            });
    }

    //Slotting
    static slotForEvent(message, slot_number, userId, callback) {
        eventChannelRequest.postSlotRequest(message.channel.id, slot_number, new User(userId))
            .then(response => {
                response.json().then(responseJson => {
                    if (response.ok) {
                        callback(slot_number, responseJson);
                    } else {
                        let reply = responseJson.errorMessage;
                        if (response.status === 404) {
                            reply = 'Es konnte nicht geslottet werden, weil das Event oder der Slot nicht gefunden wurde.';
                        }
                        MessageHelper.replyAndDelete(message, reply);
                    }
                });
            })
            .catch(reason => requestErrorHandling(reason, message));
    }

    static unslotForEvent(message, userId, callback) {
        eventChannelRequest.postUnslotRequest(message.channel.id, new User(userId))
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    static unslotSlotForEvent(message, slotNumber, callback) {
        eventChannelRequest.postUnslotSlotRequest(message.channel.id, slotNumber)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    static findSwapSlots(message, slotNumber, callback) {
        eventChannelRequest.getSwapSlots(message.channel.id, slotNumber, new User(message.author.id))
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    static blockSlot(message, slotNumber, replacementName, callback) {
        eventChannelRequest.putBlockSlot(message.channel.id, slotNumber, replacementName)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    //Event edit
    static addSlot(message, squadNumber, slotNumber, slotName, callback) {
        eventChannelRequest.postAddSlot(message.channel.id, new Slot(slotName, slotNumber), squadNumber)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    static delSlot(message, slotNumber, callback) {
        eventChannelRequest.deleteSlot(message.channel.id, slotNumber)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    static renameSlot(message, slotNumber, slotName, callback) {
        eventChannelRequest.renameSlot(message.channel.id, slotNumber, new Slot(slotName))
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }
}

function responseHandling(message, response, callback) {
    response.json().then(responseJson => {
        if (response.ok) {
            callback(responseJson);
        } else {
            let reply = responseJson.errorMessage;
            if (response.status === 404) {
                reply = `Das Angefragte konnte nicht gefunden werden. \n > ${reply}`;
            } else if (response.status === 403) {
                reply = `Du bist nicht berechtigt das auszuführen. \n > ${reply}`;
            }
            MessageHelper.replyAndDelete(message, reply);
        }
    });
}

function requestErrorHandling(error, message) {
    logger.error(error);
    MessageHelper.replyAndDelete(message, `Da ist wohl was schief gelaufen. Vielleicht gibt es hier kein Event? \n > ${error.code}`);
}

module.exports = Event;