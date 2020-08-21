const Event = require('../../modules/event');
const Slot = require('../../modules/slot');
const EventUpdate = require('../../helper/eventUpdate');

module.exports = {
    name: 'swap',
    description: 'Sendet eine Anfrage, um einen Slot mit einer Person zu tauschen',
    argCount: [1],
    usage: '<Slotnummer>',
    authorizedRoles: PermissionHelper.getSlotRoles(),
    execute(message, args) {
        logger.debug('Command: swap');

        Event.findSwapSlots(message, args[0], slots => {
            let ownSlot = slots[0];
            let foreignSlot = slots[1];

            let ownSlotUser = ownSlot.userId;
            let foreignSlotUser = foreignSlot.userId;
            let authorUser = message.author.id;

            //Swap slots, if the order has been confused
            if (ownSlotUser !== authorUser) {
                if (foreignSlotUser === authorUser) {
                    let tmpSlot = ownSlot;
                    ownSlot = foreignSlot;
                    foreignSlot = tmpSlot;
                }
            }

            if (foreignSlotUser === authorUser) {
                //No action needed if user is already on this slot
                MessageHelper.deleteMessages(message);
                return;
            } else if (foreignSlotUser === "0") {
                //TODO: Slot, if slot is empty
                MessageHelper.replyAndDelete(message, `Der Slot ist leer. Nutze einfach !slot ${foreignSlot.number}`);
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
                                    MessageHelper.deleteMessages(dmMsg);
                                });
                        });
                }
            );
        });
    }
};