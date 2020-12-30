const Event = require('../../modules/event');
const EventPrint = require('../../helper/eventPrint');
const EventUpdate = require('../../helper/eventUpdate');

module.exports = {
    name: 'eventprint',
    description: 'Gibt das Event des aktuellen Channels aus.',
    argCount: [0],
    aliases: ['showevent', 'printevent'],
    authorizedRoles: PermissionHelper.getEventManageRoles(),
    dmAllowed: false,
    execute(message, args) {
        logger.debug('Command: eventprint');

        Event.getEventByChannel(message, event => {
            if (event.infoMsg || event.slotListMsg) {
                //Event includes messageIds. Seems like event got already posted
                //TODO: Überprüfung, ob die Nachricht noch existiert. Eventuell Löschevent abfangen
                //Quick Fix: Überprüfung, ob die Nachrichten nicht gelöscht sind, falls das so ist, an den Server senden und Befehl zulassen
                MessageHelper.sendDmAndDeleteMessage(message, `Guck erstmal da <https://discordapp.com/channels/${message.guild.id}/${event.channel}/${event.infoMsg}> oder da <https://discordapp.com/channels/${message.guild.id}/${event.channel}/${event.slotListMsg}>. Mach meinetwegen ein !updateEvent aber doch nicht nochmal posten, dass will doch keiner.`);
                return;
            }

            //Send event infos
            message.channel.send(EventPrint.createEventEmbed(event))
                .then(infoMsg => {
                        //Send Spacer
                        message.channel.send('https://cdn.discordapp.com/attachments/759147249325572097/759147407040315413/AMB_Missionstrenner_Discord.png');
                        //Send SlotList
                        message.channel.send(EventPrint.createSlotListMessage(event))
                            .then(slotListMsg => {
                                //Pin message and delete pin information
                                slotListMsg.pin().then(pinMsg => MessageHelper.deleteMessages(pinMsg.channel.lastMessage));

                                //Send msgIds to database
                                Event.updateEvent(
                                    message,
                                    event.id,
                                    {infoMsg: infoMsg.id, slotListMsg: slotListMsg.id},
                                    event => EventUpdate.addEventToCache(event)
                                );

                                MessageHelper.deleteMessages(message)
                            })
                    }
                );
        });
    }
};