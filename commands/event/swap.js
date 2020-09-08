const Event = require('../../modules/event');
const Slot = require('../../modules/slot');
const EventUpdate = require('../../helper/eventUpdate');
const {prefix} = require('../../config.json');

module.exports = {
    name: 'swap',
    description: 'Sendet eine Anfrage, um einen Slot mit einer Person zu tauschen',
    argCount: [1],
    usage: '<Slotnummer>',
    authorizedRoles: PermissionHelper.getSlotRoles(),
    dmAllowed: false,
    execute(message, args) {
        logger.debug('Command: swap');

        Event.findSwapSlots(message, args[0], slots => {
            const ownSlot = slots[0];
            const foreignSlot = slots[1];

            if (!ownSlot.user || !foreignSlot.user) {
                //TODO: Slot, if slot is empty
                MessageHelper.replyAndDelete(message, `Der Slot ist leer. Nutze einfach ${prefix}slot ${foreignSlot.number}`);
                return;
            }

            const foreignSlotUser = foreignSlot.user.id;
            const authorUser = message.author.id;

            if (foreignSlotUser === authorUser) {
                //No action needed if user is already on this slot
                MessageHelper.deleteMessages(message);
                return;
            } else if (ownSlot.user.id !== authorUser) {
                MessageHelper.replyAndDelete(message, 'Tja, da ist ein Reihenfolgeproblem aufgetreten. Versuche es nochmal oder kontaktiere einen Administrator.');
                return;
            }

            MessageHelper.sendDmToRecipientAndDeleteMessage(
                message,
                foreignSlotUser,
                `${message.author} würde gerne den Slot ${ownSlot.name} (${ownSlot.number}) im Event ${ownSlot.squad.event.name} mit dir tauschen. Du bist aktuell als ${foreignSlot.name} (${foreignSlot.number}) gelistet. \n Reagiere mit 👍, um die Anfrage anzunehmen. 👎 dementsprechend, um sie abzulehnen.`,
                dmMessage => {
                    let dmMsg = dmMessage[0]; //WHY?!
                    dmMsg.react('👍').then(dmMsg.react('👎'))
                        .then(() => {
                            const filter = (reaction, user) => {
                                return ['👍', '👎'].includes(reaction.emoji.name) && user.id === foreignSlotUser;
                            };
                            dmMsg.awaitReactions(filter, {max: 1})
                                .then(collected => {
                                    const reaction = collected.first();

                                    if (reaction.emoji.name === '👍') {
                                        Slot.swap(message, slots, (event) => {
                                            MessageHelper.sendDm(message, `Dein Tauschangebot wurde angenommen. Im Event ${ownSlot.squad.event.name} bist du nun auf Slot ${foreignSlot.name} (${foreignSlot.number})`,
                                                () => MessageHelper.sendDmToRecipient(message, foreignSlotUser, `Du hast das Tauschangebot angenommen. Im Event ${ownSlot.squad.event.name} bist du nun auf Slot ${ownSlot.name} (${ownSlot.number})`, () => {}));
                                            EventUpdate.updateWithGivenEvent(message, event);
                                        });
                                    } else {
                                        MessageHelper.sendDm(message, `${client.users.cache.get(foreignSlotUser)} hat deine Anfrage zum Slot tauschen abgelehnt.`, () => MessageHelper.sendDmToRecipient(message, foreignSlotUser, 'Du hast das Tauschangebot abgelehnt.', () => {}));
                                    }
                                    MessageHelper.deleteDm(dmMsg);
                                });
                        });
                }
            );
        });
    }
};