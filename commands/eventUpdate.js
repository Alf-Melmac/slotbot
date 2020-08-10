const EventUpdate = require('../helper/eventUpdate');

module.exports = {
    name: 'eventupdate',
    description: 'Aktualisiert das Event im aktuellen Kanal',
    argCount: [0],
    aliases: ['eventrefresh', 'updateevent'],
    usage: ' ',
    authorizedRoles: PermissionHelper.getEventManageRoles(),
    execute(message, args) {
        logger.debug('Command: eventupdate');

        EventUpdate.update(message);
    }
};