const {prefix} = require('../../config.json');
const Bot = require("../../bot");
const Event = require('../../modules/event');
const Slot = require('../../modules/slot');
const EventUpdate = require('../../helper/eventUpdate');
const Validator = require("../../helper/validator");
let pendingSwapRequests = new Map();
let pendingSwapDmMessages = new Map();

module.exports = {
    name: 'swap',
    description: 'Sendet eine Anfrage, um einen Slot mit einer Person zu tauschen.',
    argCount: [1],
    usage: '<Slotnummer>',
    authorizedRoles: PermissionHelper.getSlotRoles(),
    dmAllowed: false,
    execute(message, args) {
        logger.debug('Command: swap');

        const id = args[0].replace(/\D/g, '');

        if (Validator.isUserMention(args[0])) {
            Event.findSwapSlotsByUser(message, id, slots => swap(message, slots));
        } else {
            if (Validator.onlyNumbers(args[0])) {
                MessageHelper.replyAndDelete(message, 'Bitte übergebe eine Slotnummer oder einen Nutzer.');
                return;
            }

            Event.findSwapSlots(message, id, slots => swap(message, slots));
        }
    }
};

function swap(message, slots) {
    const ownSlot = slots[0];
    const foreignSlot = slots[1];

    if (!ownSlot.user || !foreignSlot.user) {
        //TODO: Slot, if slot is empty
        MessageHelper.replyAndDelete(message, `Der Slot ist leer. Nutze einfach ${prefix}slot ${foreignSlot.number}`);
        return;
    }

    const ownSlotUser = ownSlot.user.id;
    const foreignSlotUser = foreignSlot.user.id;
    const authorUser = message.author.id;

    if (foreignSlotUser === authorUser) {
        //No action needed if user is already on this slot
        MessageHelper.deleteMessages(message);
        return;
    } else if (ownSlotUser !== authorUser) {
        MessageHelper.replyAndDelete(message, 'Tja, da ist ein Reihenfolgeproblem aufgetreten. Versuche es nochmal oder kontaktiere einen Administrator.');
        return;
    } else if (pendingSwapRequests.has(ownSlotUser)) {
        MessageHelper.replyAndDelete(message, 'Es besteht bereits eine Swap-Anfrage.');
        return;
    } else if (pendingSwapRequests.get(foreignSlotUser) && pendingSwapRequests.get(foreignSlotUser) === ownSlotUser) {
        //Opposite swap request to an already existing one
        performSwap(message, slots, foreignSlot, foreignSlotUser, ownSlot, ownSlotUser);
        pendingSwapRequests.delete(foreignSlotUser);
        MessageHelper.deleteDm(pendingSwapDmMessages.get(foreignSlotUser));
        pendingSwapDmMessages.delete(foreignSlotUser);
        return;
    }

    MessageHelper.sendDmToRecipientAndDeleteMessage(
        message,
        foreignSlotUser,
        `${message.author} würde gerne den Slot ${ownSlot.name} (${ownSlot.number}) im Event ${ownSlot.squad.event.name} mit dir tauschen. Du bist aktuell als ${foreignSlot.name} (${foreignSlot.number}) gelistet. \n Reagiere mit 👍, um die Anfrage anzunehmen. 👎 dementsprechend, um sie abzulehnen.`,
        dmMessage => {
            let dmMsg = dmMessage[0]; //WHY?!

            pendingSwapRequests.set(ownSlotUser, foreignSlotUser);
            pendingSwapDmMessages.set(ownSlotUser, dmMsg);

            dmMsg.react('👍').then(dmMsg.react('👎'))
                .then(() => {
                    const filter = (reaction, user) => {
                        return ['👍', '👎'].includes(reaction.emoji.name) && user.id === foreignSlotUser;
                    };
                    dmMsg.awaitReactions(filter, {max: 1})
                        .then(collected => {
                            if (!pendingSwapRequests.has(ownSlotUser)) {
                                MessageHelper.deleteDm(dmMsg);
                                return;
                            }

                            const reaction = collected.first();

                            if (reaction.emoji.name === '👍') {
                                performSwap(message, slots, ownSlot, ownSlotUser, foreignSlot, foreignSlotUser);
                            } else {
                                MessageHelper.sendDm(message, `${Bot.client.users.cache.get(foreignSlotUser)} hat deine Anfrage zum Slot tauschen abgelehnt.`, () => MessageHelper.sendDmToRecipient(message, foreignSlotUser, 'Du hast das Tauschangebot abgelehnt.', () => {}));
                            }
                            pendingSwapRequests.delete(ownSlotUser);
                            MessageHelper.deleteDm(dmMsg);
                            pendingSwapDmMessages.delete(ownSlotUser);
                        });
                });
        }
    );
}

function performSwap(message, slots, originalSlot, originalSlotUser, swappedSlot, swappedSlotUser) {
    Slot.swap(message, slots, (event) => {
        MessageHelper.sendDmToRecipient(message, originalSlotUser, `Dein Tauschangebot wurde angenommen. Im Event ${originalSlot.squad.event.name} bist du nun auf Slot ${swappedSlot.name} (${swappedSlot.number})`,
            () => MessageHelper.sendDmToRecipient(message, swappedSlotUser, `Du hast das Tauschangebot angenommen. Im Event ${originalSlot.squad.event.name} bist du nun auf Slot ${originalSlot.name} (${originalSlot.number})`, () => {
            }));
        EventUpdate.updateWithGivenEvent(message, event);
    });
}