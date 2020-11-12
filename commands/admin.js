const statusRequest = require("../modules/rest/statusRequest");

module.exports = {
    name: 'admin',
    description: 'Admin Funktionalitäten!',
    argCount: [1],
    authorizedRoles: PermissionHelper.getAdministrativeRoles(),
    dmAllowed: true,
    execute(message, args) {
        logger.debug('Command: admin');

        switch (args[0]) {
            case 'pinga':
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
                }).catch(error => {
                    logger.error(error);
                    MessageHelper.replyAndDeleteOnlySend(message, error.message);
                });
                break;
            case 'channelTest':
                let channel = message.channel;
                logger.info(channel);
                logger.info(`Channel ID: ${message.channel.id}`);
                logger.info(`Channel name: ${message.channel.name}`);
                break;
            case 'userTest':
                let author = message.author;
                logger.info(author.id);
                break;
            case 'clearChannel':
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
            case 'stop':
                if (message.author.id === '185067296623034368') {
                    logger.info('Stop command received');
                    MessageHelper.deleteMessages(message);
                    process.exit();
                }
                break;
        }

        MessageHelper.deleteMessages(message);
    },
};