const statusRequest = require("../modules/rest/statusRequest");

module.exports = {
    name: 'admin',
    description: 'Admin utility!',
    argCount: [1],
    authorizedRoles: PermissionHelper.getAdministrativeRoles(),
    execute(message, args) {
        logger.debug('Command: admin');

        switch (args[0]) {
            case 'pinga':
                logger.debug(`Channel ID: ${message.channel.id}`);
                logger.debug(`Channel name: ${message.channel.name}`);
                MessageHelper.replyAndDeleteOnlySend(message, 'Pong.');
                break;
            case 'pingb':
                statusRequest.getPingRequest().then(response => {
                    MessageHelper.replyAndDeleteOnlySend(message, `${response.status} ${response.statusText}`);
                    if (response.ok) {
                        logger.info('Ping ok');
                    } else {
                        logger.warn('Ping != ok');
                    }
                }).catch(logger.error);
                break;
            case 'stop':
                if (message.author.id === '185067296623034368') {
                    logger.info('Stop command received');
                    MessageHelper.deleteMessages(message);
                    process.exit();
                }
                break;
            case 'channelTest':
                let channel = message.channel;
                logger.info(channel);
                logger.info(channel.id);
                logger.info(channel.name);
                break;
            case 'userTest':
                let author = message.author;
                logger.info(author.id);
                break;
            case 'del':
                if (message.author.id === '185067296623034368') {
                    (async () => {
                        let fetched;
                        do {
                            fetched = await message.channel.messages.fetch({limit: 100});
                            await message.channel.bulkDelete(fetched);
                        }
                        while (fetched.size >= 2);
                    })()
                }
                break;
        }

        MessageHelper.deleteMessages(message);
    },
};