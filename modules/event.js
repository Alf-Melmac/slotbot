const Discord = require('discord.js');
const Slot = require('../modules/slot');
const eventRequest = require("./rest/eventRequest");

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
            .then(response => responseHandling(message, response, () => {/*Atm we do not need the event in the callback function*/}))
            .catch(reason => {
                logger.error(reason);
                MessageHelper.replyAndDeleteOnlySend(message, 'Jetzt bin ich selber durcheinander gekommen wer hier warum wann Nachrichten sendet.');
            })
            .finally(() => MessageHelper.deleteMessages(message));
    }

    //Get Event
    static getEventByChannel(message, callback) {
        eventRequest.getEventByChannelRequest(message.channel.id, callback)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    static getEventByChannelWithoutReply(messageClone, callback) {
        eventRequest.getEventByChannelRequest(messageClone.channel.id, callback)
            .then(response => {
                if (response.ok) {
                    response.json().then(json => callback(json));
                }
            });
    }

    //Slotting
    static slotForEvent(message, slot_number, userId, callback) {
        eventRequest.postSlotRequest(message.channel.id, slot_number, userId)
            .then(response => {
                if (response.ok) {
                    response.json().then(json => callback(slot_number, json));
                } else {
                    MessageHelper.replyAndDeleteOnlySend(message, 'Da kam keine positive Antwort vom Server zurück, als ich versucht habe dich zu slotten. Probiere es später nochmal oder Frage wen mit Ahnung.')
                }
            })
            .catch(reason => requestErrorHandling(reason, message));
    }

    static unslotForEvent(message, userId, callback) {
        eventRequest.postUnslotRequest(message.channel.id, userId)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    //Event edit
    static addSlot(message, squadNumber, slotNumber, slotName, callback) {
        eventRequest.postAddSlot(message.channel.id, JSON.stringify(new Slot(slotName, slotNumber)), squadNumber)
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }

    static delSlot(message, slotNumber, callback) {
        eventRequest.deleteSlot(message.channel.id, slotNumber)
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
    if (response.ok) {
        response.json().then(json => callback(json));
    } else {
        response.json().then(errorJson => MessageHelper.replyAndDelete(message, errorJson.errorMessage));
    }
}

function requestErrorHandling(error, message) {
    logger.error(error);
    MessageHelper.replyAndDelete(message, 'Da ist wohl was schief gelaufen. Vielleicht gibt es hier kein Event?');
}

module.exports = Event;