const Event = require('../../modules/event');
const EventUpdate = require('../../helper/eventUpdate');

module.exports = {
    name: 'unslot',
    description: 'Slottet dich selbst oder jemand anderen aus',
    argCount: [0, 1],
    aliases: ['forceunslot'],
    usage: '<@AuzuslottendePerson>',
    authorizedRoles: PermissionHelper.getSlotRoles(),
    dmAllowed: false,
    execute(message, args) {
        logger.debug('Command: unslot');

        if (args.length === 0) {
            //Self unslot
            Event.unslotForEvent(message, message.author.id, (event) => {
                MessageHelper.sendDm(message, `Du hast dich für das Event ${event.name} am ${event.date} ausgetragen.`, () => {});
                EventUpdate.updateWithGivenEvent(message, event);
            });
        } else /*if (args.length === 1)*/ {
            let recipientId = args[0].replace(/\D/g, '');
            if (PermissionHelper.hasEventManageRole(message)) {
                Event.unslotForEvent(message, recipientId, (event) => {
                    MessageHelper.sendDmToRecipient(message, recipientId, `${message.author} hat dich für das Event ${event.name} am ${event.date} ausgetragen.`, () => {});
                    EventUpdate.updateWithGivenEvent(message, event);
                });
            } else {
                MessageHelper.replyAndDelete(message, 'Du darfst leider keine anderen Personen ausslotten.');
            }
        }
    }
};