const {prefix} = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Liste aller Befehle oder Information über einen Befehl.',
    argCount: [0, 1],
    aliases: ['commands'],
    usage: '<command name>',
    authorizedRoles: ['@everyone'],
    execute(message, args) {
        logger.debug('Command: help');

        const data = [];
        const {commands} = message.client;

        if (!args.length) {
            data.push('Liste aller Befehle:');
            data.push(
                commands.filter(command => PermissionHelper.authorHasAtLeastOneOfRoles(message, command.authorizedRoles))
                    .map(command => command.name)
                    .join(', ')
            );
            data.push(`\nSchicke einfach "${prefix}help [command name]" um Infos über einen bestimmten Befehl zu bekommen!`);

            return MessageHelper.sendDmAndDeleteMessage(message, data);
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return MessageHelper.replyAndDelete(message, 'Den Befehl kenne ich nicht');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        MessageHelper.sendDmAndDeleteMessage(message, data);
    }
};