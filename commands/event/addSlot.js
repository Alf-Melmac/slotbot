const Event = require('../../modules/event');
const EventUpdate = require('../../helper/eventUpdate');

module.exports = {
    name: 'addslot',
    description: 'Fügt einem Event einen Slot hinzu. Squads sind durchnummeriert, beginnend mit 0.',
    argCount: [3],
    aliases: ['eventaddslot'],
    usage: '<Squad Position> <Slotnummer> <Slotname>',
    authorizedRoles: PermissionHelper.getEventManageRoles(),
    dmAllowed: false,
    execute(message, args) {
        logger.debug('Command: addslot');

        Event.addSlot(message, args[0], args[1], args[2], event => EventUpdate.updateWithGivenEvent(message, event));
    }
};