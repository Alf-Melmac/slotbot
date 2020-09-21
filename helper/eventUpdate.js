const {prefix} = require('../config.json');
const _ = require('lodash');
let eventCache = new Map();
const Event = require('../modules/event');

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
            .then(infoMsg => infoMsg.edit(Event.createEventEmbed(event)))
            .catch(logger.error);

        message.channel.messages.fetch(event.slotListMsg)
            .then(infoMsg => infoMsg.edit(Event.createSlotListMessage(event)))
            .catch(logger.error);
    }

    static addEventToCache(event) {
        if (_.isEqualWith(eventCache.get(event.channel), event)) {
            //No update required
            return false;
        }
        eventCache.set(event.channel, event);
        return true;
    }
}

module.exports = EventUpdate;