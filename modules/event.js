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
            .then(response => {
                if (response.ok) {
                    response.json().then(json => callback(json));
                } else {
                    logger.error(response);
                    MessageHelper.replyAndDelete(message, `${response.status} ${response.statusText}`);
                }
            })
            .catch(reason => {
                logger.error(reason);
                MessageHelper.replyAndDelete(message, 'Des Event konnte ich nicht an den Server senden. Such dir einen Grund aus, warum nicht. Machs später nochmal.');
            });
    }

    static putMessageIds(message, eventId, channelIds, callback) {
        eventRequest.putChannelIdsRequest(eventId, JSON.stringify(channelIds))
            .then(response => {
                if (response.ok) {
                    response.json().then(json => callback(json));
                } else {
                    logger.error(response);
                    MessageHelper.replyAndDelete(message, 'Da kam keine positive Antwort vom Server zurück, als ich versucht habe MessageIds zu setzen. Probiere es später nochmal oder Frage wen mit Ahnung.')
                }
            })
            .catch(reason => {
                logger.error(reason);
                MessageHelper.replyAndDelete(message, 'Jetzt bin ich selber durcheinander gekommen wer hier warum wann Nachrichten sendet.');
            });
    }

    static getEventByChannel(message, callback) {
        eventRequest.getEventByChannelRequest(message.channel.id, callback)
            .then(response => {
                if (response.ok) {
                    response.json().then(json => callback(json));
                } else {
                    MessageHelper.replyAndDelete(message, 'Da kam keine positive Antwort vom Server zurück, als ich versucht habe das Event zu bekommen. Probiere es später nochmal oder Frage wen mit Ahnung.')
                }
            })
            .catch(reason => {
                logger.error(reason);
                MessageHelper.replyAndDelete(message, 'Scheint so, als gäbe es hier gar kein Event.');
            });
    }

    static getEventByChannelWithoutReply(messageClone, callback) {
        eventRequest.getEventByChannelRequest(messageClone.channel.id, callback)
            .then(response => {
                if (response.ok) {
                    response.json().then(json => callback(json));
                }
            });
    }

    static slotForEvent(message, slot_number, userId, callback) {
        eventRequest.postSlotRequest(message.channel.id, slot_number, userId)
            .then(response => {
                if (response.ok) {
                    response.json().then(json => callback(slot_number, json));
                } else {
                    MessageHelper.replyAndDeleteOnlySend(message, 'Da kam keine positive Antwort vom Server zurück, als ich versucht habe dich zu slotten. Probiere es später nochmal oder Frage wen mit Ahnung.')
                }
            })
            .catch(reason => {
                logger.error(reason);
                MessageHelper.replyAndDeleteOnlySend(message, `Entweder hier gibt es kein Event oder irgendwas ist schief gelaufen.`);
            });
    }

    static unslotForEvent(message, userId, callback) {
        eventRequest.postUnslotRequest(message.channel.id, userId)
            .then(response => {
                if (response.ok) {
                    response.json().then(json => callback(json));
                } else {
                    MessageHelper.replyAndDelete(message, 'Da kam keine positive Antwort vom Server zurück, als ich versucht habe dich zu unslotten. Probiere es später nochmal oder Frage wen mit Ahnung.')
                }
            })
            .catch(reason => {
                logger.error(reason);
                MessageHelper.replyAndDelete(message, `Entweder hier gibt es kein Event oder irgendwas ist schief gelaufen.`);
            });
    }

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

module.exports = Event;