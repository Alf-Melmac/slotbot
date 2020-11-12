const Event = require('../../modules/event');
const EventUpdate = require('../../helper/eventUpdate');
const Validator = require("../../helper/validator");

module.exports = {
    name: 'slot',
    description: 'Slottet dich selbst oder jemand anderen.',
    argCount: [1, 2],
    aliases: ['forceslot'],
    usage: '<Slotnummer> (<@ZuSlottendePerson>)',
    authorizedRoles: PermissionHelper.getSlotRoles(),
    dmAllowed: false,
    execute(message, args) {
        logger.debug('Command: slot');

        if (Validator.onlyNumbers(args[0])) {
            MessageHelper.replyAndDelete(message, 'Bitte übergebe an erster Stelle eine Slotnummer.');
            return;
        }

        if (args.length === 1) {
            //Self slot
            Event.slotForEvent(message, args[0], message.author.id, (slotNumber, event) => {
                MessageHelper.sendDm(message, `Du hast dich für das Event ${event.name} am ${event.date} auf den Slot ${slotNumber} eingetragen.`, () => {} );
                EventUpdate.updateWithGivenEvent(message, event);
            });
        } else /*if (args.length === 2)*/ {
            let recipientId = args[1].replace(/\D/g, '');
            if (PermissionHelper.hasEventManageRole(message)) {
                if (!Validator.isUserMention(args[1])) {
                    MessageHelper.replyAndDelete(message, 'Bitte übergebe an zweiter Stelle eine Person.');
                    return;
                }

                Event.slotForEvent(message, args[0], recipientId, (slotNumber, event) => {
                    MessageHelper.sendDmToRecipient(message, recipientId, `${message.author} hat dich für das Event ${event.name} am ${event.date} auf den Slot ${slotNumber} eingetragen.`, () => {});
                    EventUpdate.updateWithGivenEvent(message, event);
                });
            } else {
                MessageHelper.replyAndDelete(message, 'Du darfst leider keine anderen Personen slotten.');
            }
        }
    }
};