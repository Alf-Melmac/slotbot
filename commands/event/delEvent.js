const Event = require('../../modules/event');

module.exports = {
    name: 'delevent',
    description: 'Entfernt einen Slot aus einem Event.',
    argCount: [0],
    aliases: ['eventdel', 'deleteevent', 'removeevent'],
    usage: ' ',
    authorizedRoles: PermissionHelper.getAdministrativeRoles(),
    dmAllowed: false,
    execute(message, args) {
        logger.debug('Command: delEvent');

        Event.delEvent(message, () => {
            message.channel.messages.fetch({limit: 100}).then(messages => {
                //Remove all Bot messages (should only be Event infos and slot Message)
                const botMessages = messages.filter(oneMessage => oneMessage.author === client.user);
                message.channel.bulkDelete(botMessages);
                MessageHelper.deleteMessages(message);
            });
        });
    }
};