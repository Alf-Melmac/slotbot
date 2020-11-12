const Event = require('../../modules/event');
const EventUpdate = require('../../helper/eventUpdate');

module.exports = {
    name: 'blockslot',
    description: 'Sperrt einen Slot und setzt, falls angegeben, den Text an dessen Stelle.',
    argCount: [1, 2],
    aliases: ['slotblock'],
    usage: '<Slotnummer> ("<Ersatzname>")',
    authorizedRoles: PermissionHelper.getEventManageRoles(),
    dmAllowed: false,
    execute(message, args) {
        logger.debug('Command: blockSlot');

        Event.blockSlot(message, args[0], args[1], event => EventUpdate.updateWithGivenEvent(message, event));
    }
};