const Event = require('../../modules/event');
const EventUpdate = require('../../helper/eventUpdate');

module.exports = {
    name: 'renameslot',
    description: 'Ermöglicht es einen Slot umzubenennen.',
    argCount: [2],
    aliases: ['editslot', 'eventrenameslot'],
    usage: '<Slotnummer> "<Slotname>"',
    authorizedRoles: PermissionHelper.getEventManageRoles(),
    dmAllowed: false,
    execute(message, args) {
        logger.debug('Command: renameSlot');

        Event.renameSlot(message, args[0], args[1], event => EventUpdate.updateWithGivenEvent(message, event));
    }
};