const Discord = require('discord.js');
const Slot = require('../modules/slot');
const eventRequest = require("./rest/eventRequest");
const eventChannelRequest = require("./rest/eventChannelRequest");

class Event {
    constructor(name, date, startTime, description, channel, squadList, infoMsg, slotListMsg) {
        this.name = name;
        this.date = date;
        this.startTime = startTime;
        this.description = description;
        this.channel = channel;
        this.squadList = squadList;
        this.infoMsg = infoMsg;
        this.slotListMsg = slotListMsg;
    }

    static postEvent(message, event, callback) {
        eventRequest.postEventRequest(JSON.stringify(event))
            .then(response => responseHandling(message, response, callback))
            .catch(reason => {
                logger.error(reason);
                MessageHelper.replyAndDelete(message, 'Des Event konnte ich nicht an den Server senden. Such dir einen Grund aus, warum nicht. Machs später nochmal.');
            });
    }

    static putMessageIds(message, eventId, channelIds, callback) {
        eventRequest.putChannelIdsRequest(eventId, JSON.stringify(channelIds))
            .then(response => responseHandling(message, response, callback))
            .catch(reason => {
                logger.error(reason);
                MessageHelper.replyAndDelete(message, 'Jetzt bin ich selber durcheinander gekommen wer hier warum wann Nachrichten sendet.');
            });
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
        eventChannelRequest.postSlotRequest(message.channel.id, slot_number, userId)
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
        eventChannelRequest.postUnslotRequest(message.channel.id, userId)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    static findSwapSlots(message, slotNumber, callback) {
        eventChannelRequest.getSwapSlots(message.channel.id, slotNumber, message.author.id)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    //Event edit
    static addSlot(message, squadNumber, slotNumber, slotName, callback) {
        eventChannelRequest.postAddSlot(message.channel.id, JSON.stringify(new Slot(slotName, slotNumber)), squadNumber)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    static delSlot(message, slotNumber, callback) {
        eventChannelRequest.deleteSlot(message.channel.id, slotNumber)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    //Event messages
    static createEventEmbed(event) {
        // noinspection UnnecessaryLocalVariableJS
        let eventEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(event.name)
            //.setURL('Event url')
            .setDescription(event.description)
            //.setThumbnail('Event picture');
            .addField("Startzeit", event.startTime)
        return eventEmbed;
    }

    static createSlotListEmbed(event) {
        let slotListEmbed = new Discord.MessageEmbed()
            .setTitle("Teilnahmeplatzaufzählung");

        for (let squad of event.squadList) {
            let slotList = '';
            for (let slot of squad.slotList) {
                //Needed to call a method from a object, because no casting is available
                slotList += Slot.prototype.toString.call(slot) + '\n';
            }
            //Add squad as field
            slotListEmbed.addField(squad.name, slotList);
            //Add spacer between squads
            slotListEmbed.addField('\u200B', '\u200B');
        }

        return slotListEmbed;
    }
}

function responseHandling(message, response, callback) {
    response.json().then(responseJson => {
        if (response.ok) {
            callback(responseJson);
        } else {
            let reply = responseJson.errorMessage;
            if (response.status === 404) {
                reply = `Hier konnte kein Event gefunden werden. \n > ${reply}`;
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