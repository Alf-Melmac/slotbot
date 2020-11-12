const {prefix} = require('../config.json');
const _ = require('lodash');
const Event = require('../modules/event');
const EventPrint = require('../helper/eventPrint');
let eventCache = new Map();

class EventUpdate {
    static update(message) {
        Event.getEventByChannel(message, event => {
            this.updateWithGivenEvent(message, event);
        });
    }

    static updateWithGivenEvent(message, event) {
        if (!event.infoMsg || event.infoMsg === "0" || !event.slotListMsg || event.slotListMsg === "0") {
            MessageHelper.replyAndDelete(message, `Gib das Event zu erst mit ${prefix}eventPrint aus`);
            return;
        }

        this.updateIfNotCached(message, event);

        MessageHelper.deleteMessages(message);
    }

    static updateIfNotCached(message, event) {
        if (!this.addEventToCache(event)) {
            return;
        }

        logger.debug('Update');

        message.channel.messages.fetch(event.infoMsg)
            .then(infoMsg => infoMsg.edit(EventPrint.createEventEmbed(event)))
            .catch(logger.error);

        message.channel.messages.fetch(event.slotListMsg)
            .then(slotListMsg => slotListMsg.edit(EventPrint.createSlotListMessage(event)))
            .catch(logger.error);
    }

    static addEventToCache(event) {
        if (_.isEqual(eventCache.get(event.id), event)) {
            //No update required
            return false;
        }
        eventCache.set(event.id, event);
        return true;
    }
}

module.exports = EventUpdate;