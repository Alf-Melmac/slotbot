const Event = require('../../modules/event');
const EventUpdate = require('../../helper/eventUpdate');

module.exports = {
    name: 'eventprint',
    description: 'Gibt das Event des aktuellen Channels aus.',
    argCount: [0],
    aliases: ['showevent'],
    usage: ' ',
    authorizedRoles: PermissionHelper.getEventManageRoles(),
    dmAllowed: false,
    execute(message, args) {
        logger.debug('Command: eventprint');

        Event.getEventByChannel(message, event => {
            if (event.infoMsg && event.infoMsg !== '0' || event.slotListMsg && event.slotListMsg !== '0') {
                //Event includes messageIds. Seems like event got already posted
                //TODO: Überprüfung, ob die Nachricht noch existiert. Eventuell Löschevent abfangen
                //Quick Fix: Überprüfung, ob die Nachrichten nicht gelöscht sind, falls das so ist, an den Server senden und Befehl zulassen
                MessageHelper.sendDmAndDeleteMessage(message, `Guck erstmal da <https://discordapp.com/channels/${message.guild.id}/${event.channel}/${event.infoMsg}> oder da <https://discordapp.com/channels/${message.guild.id}/${event.channel}/${event.slotListMsg}>. Mach meinetwegen ein !updateEvent aber doch nicht nochmal posten, dass will doch keiner.`);
                return;
            }

            //Send event infos
            message.channel.send(Event.createEventEmbed(event))
                .then(infoMsg =>
                    //Send SlotList
                    message.channel.send(Event.createSlotListEmbed(event))
                        .then(slotListMsg => {
                            //Pin message and delete pin information
                            slotListMsg.pin().then(pinMsg => MessageHelper.deleteMessages(pinMsg.channel.lastMessage));

                            //Send msgIds to database
                            Event.putMessageIds(
                                message,
                                event.id,
                                {infoMsg: infoMsg.id, slotListMsg: slotListMsg.id},
                                event => EventUpdate.addEventToCache(event)
                            );

                            MessageHelper.deleteMessages(message)
                        })
                );
        });
    }
};