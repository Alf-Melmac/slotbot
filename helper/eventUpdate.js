const {prefix} = require('../config.json');
const _ = require('lodash');
let eventCache = new Map();
const Event = require('../modules/event');

class EventUpdate {
    static updateAfterDelay(message) {
        setTimeout(() => this.updateWithoutReply(message), 1000);
    }

    //TODO Check functionality
    static updateWithoutReply(message) {
        Event.getEventByChannelWithoutReply(message, event => {
            if (!event.infoMsg || !event.slotListMsg) {
                return;
            }

            this.updateIfNotCached(message, event);
        });
    }

    static update(message) {
        Event.getEventByChannel(message, event => {
            this.updateWithGivenEvent(message, event);
        });
    }

    static updateWithGivenEvent(message, event) {
        if (!event.infoMsg || !event.slotListMsg) {
            MessageHelper.replyAndDelete(message, `Gib das Event zu erst mit ${prefix}eventPrint aus`);
            return;
        }

        this.updateIfNotCached(message, event);

        MessageHelper.deleteMessages(message);
    }

    static updateIfNotCached(message, event) {
        if (_.isEqualWith(eventCache.get(event.channel), event)) {
            //No update required
            return;
        } else {
            eventCache.set(event.channel, event);
        }

        console.log('Update');

        message.channel.messages.fetch(event.infoMsg)
            //Building a new embed to prevent caching problems. See: https://discordjs.guide/popular-topics/embeds.html#resending-a-received-embed
            .then(infoMsg => infoMsg.edit(Event.createEventEmbed(event)))
            .catch(logger.error);

        message.channel.messages.fetch(event.slotListMsg)
            //Building a new embed to prevent caching problems
            .then(infoMsg => infoMsg.edit(Event.createSlotListEmbed(event)))
            .catch(logger.error);
    }
}

module.exports = EventUpdate;