const Event = require('../../modules/event');

module.exports = {
    name: 'eventjson',
    description: 'Erstellt ein Event aus einem JSON-String. Für einfache Erstellung z.B. hier schauen https://jsonformatter-online.com/',
    argCount: [1],
    aliases: ['event', 'newevent', 'createevent'],
    usage: '<JSON>',
    authorizedRoles: PermissionHelper.getEventManageRoles(),
    dmAllowed: false,
    execute(message, args) {
        logger.debug('Command: eventjson');

        const json = args[0];

        if (!validateJsonString(json)) {
            MessageHelper.replyAndDelete(message, "Ungültiges JSON format. Bitte Syntax korrigieren.");
            return;
        }

        let event = JSON.parse(json);
        event.channel = message.channel.id;
        Event.postEvent(message, event, eventJson => {
            MessageHelper.replyAndDelete(message, eventJson)
        });
    }
};

function validateJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        logger.debug("Invalid JSON string: " + str);
        return false;
    }
    logger.debug("Valid JSON string");
    return true;
}