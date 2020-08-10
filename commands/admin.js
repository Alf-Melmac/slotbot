module.exports = {
    name: 'admin',
    description: 'Admin utility!',
    argCount: [1],
    authorizedRoles: PermissionHelper.getAdministrativeRoles(),
    execute(message, args) {
        logger.debug('Command: admin');

        switch (args[0]) {
            case 'ping':
                logger.debug(`Message: ${message.channel.id}`);
                logger.debug(`Channel: ${message.channel.name}`);
                MessageHelper.replyAndDelete(message, 'Pong.');
                break;
            case 'stop':
                logger.info('Stop command received');
                process.exit();
                break;
            case 'channelTest':
                let channel = message.channel;
                console.log(channel);
                console.log(channel.id);
                console.log(channel.name);
                break;
            case 'userTest':
                let author = message.author;
                console.log(author);
                console.log(author.id);
        }
    },
};