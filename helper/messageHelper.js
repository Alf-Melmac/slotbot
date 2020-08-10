const standardDeletionTime = 2500;

class MessageHelper {
    static isDm(message) {
        return message.guild === null;
    }

    static deleteMessages(...args) {
        MessageHelper.deleteMessagesWithTimeout(0, ...args);
    }

    static deleteMessagesWithTimeout(timeout) {
        for (let i = 1; i < arguments.length; i++) {
            let message = arguments[i];
            //Deletion in DMs or groups isn't possible and would result in an error
            if (!MessageHelper.isDm(message)) {
                message.delete({timeout: timeout})
                    .catch(logger.warn);
            }
        }
    }

    static replyAndDelete(message, reply) {
        message.reply(reply).then(msg => MessageHelper.deleteMessagesWithTimeout(standardDeletionTime, message, msg));
    }

    static replyAndDeleteOnlySend(message, reply) {
        message.reply(reply).then(msg => MessageHelper.deleteMessagesWithTimeout(standardDeletionTime, msg));
    }

    static sendDm(message, dataToSend, callback) {
        return message.author.send(dataToSend, {split: true})
            .catch(error => {
                logger.error(`Could not send DM to ${message.author.tag}.\n`, error);
                MessageHelper.replyAndDeleteOnlySend(message, 'Erlaube mir doch bitte dir eine private Nachricht zu senden :(');
            })
            .finally(callback());
    }

    static sendDmAndDeleteMessage(message, dataToSend) {
        this.sendDm(message, dataToSend, () => MessageHelper.deleteMessages(message));
    }

    static sendDmToRecipient(message, recipientId, dataToSend, callback) {
        const recipient = client.users.cache.get(recipientId);
        return recipient.send(dataToSend, {split: true})
            .catch(error => {
                logger.error(`Could not send DM to ${recipient.tag}.\n`, error);
                MessageHelper.replyAndDeleteOnlySend(message, `Leider kann ich ${recipient.tag} keine DM senden. Hau den doch mal für mich.`);
            })
            .finally(callback());
    }

    static sendDmToRecipientAndDeleteMessage(message, recipientId, dataToSend) {
        this.sendDmToRecipient(message, recipientId, dataToSend, () => MessageHelper.deleteMessages(message));
    }
}

module.exports = MessageHelper;