const Event = require('../../modules/event');
const EventUpdate = require('../../helper/eventUpdate');

module.exports = {
    name: 'delslot',
    description: 'Entfernt einen Slot aus einem Event.',
    argCount: [1],
    aliases: ['eventdelslot'],
    usage: '<Slotnummer>',
    authorizedRoles: PermissionHelper.getEventManageRoles(),
    execute(message, args) {
        logger.debug('Command: delslot');

        Event.delSlot(message, args[0], event => EventUpdate.updateWithGivenEvent(message, event));
    }
};