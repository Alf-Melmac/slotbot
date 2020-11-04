const Event = require('../../modules/event');

module.exports = {
    name: 'addeventtochannel',
    description: 'Ordnet einem Event den aktuellen Kanal zu.',
    argCount: [1],
    aliases: ['addchannel', 'addevent'],
    usage: '<EventId>',
    authorizedRoles: PermissionHelper.getEventManageRoles(),
    dmAllowed: false,
    execute(message, args) {
        logger.debug('Command: addEventToChannel');

        Event.updateEvent(message, args[0], {channel: message.channel.id}, event => MessageHelper.replyAndDelete(message, `Event ${event.name} dem aktuellen Kanal hinzugefügt.`));
    }
};