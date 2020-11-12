const {prefix} = require('../config.json');
const _ = require('lodash');

module.exports = {
    name: 'help',
    description: 'Gibt alle Befehle oder Informationen über einen Befehl aus.',
    argCount: [0, 1],
    aliases: ['commands'],
    usage: '(<Befehlsname>)',
    authorizedRoles: ['@everyone'],
    dmAllowed: true,
    execute(message, args) {
        logger.debug('Command: help');

        const data = [];
        const {commands} = message.client;

        if (!args.length) {
            if (MessageHelper.isDm(message)) {
                MessageHelper.replyInDM(message, 'Um die richtigen Befehle anzeigen zu können, muss dieser Befehl auf dem Server ausgeführt werden.');
                return;
            }
            data.push('Liste aller Befehle:');
            data.push(
                commands.filter(command => PermissionHelper.authorHasAtLeastOneOfRoles(message, command.authorizedRoles))
                    .map(command => command.name)
                    .join(', ')
            );
            data.push(`\nSchicke einfach "${prefix}${this.name} ${this.usage.replaceAll(/[()]/, '')}" um Infos über einen bestimmten Befehl zu bekommen!`);

            return MessageHelper.sendDmAndDeleteMessage(message, data);
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return MessageHelper.replyAndDelete(message, 'Den Befehl kenne ich nicht.');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliase:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Beschreibung:** ${command.description}`);
        let usage = `**Benutzung:** ${prefix}${command.name}`;
        if (_.isEqual(command.argCount, [0])) {
            data.push(usage);
        } else if (command.usage) {
            data.push(`${usage} ${command.usage}`);
        }

        MessageHelper.sendDmAndDeleteMessage(message, data);
    }
};