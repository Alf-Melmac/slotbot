const Discord = require('discord.js');
const Squad = require('../modules/squad');

class EventPrint {
    static createEventEmbed(event) {
        // noinspection JSCheckFunctionSignatures
        return new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle(event.name)
            //.setURL('Event url')
            .setDescription(event.description)
            .setThumbnail('https://cdn.discordapp.com/attachments/739819127740301363/739843573620539402/Mission.png')
            // .setImage('https://cdn.discordapp.com/attachments/739819127740301363/739843573620539402/Mission.png')
            .addFields(buildFields(event))
            .setFooter('AmB wünscht viel Spaß!', 'https://cdn.discordapp.com/attachments/759147249325572097/759147455483740191/AM-Blau-big-bananemitschokokuchen.jpg')
            .setTimestamp();
    }

    static createSlotListMessage(event) {
        let slotListMessage = '__**Teilnahmeplatzaufzählung**__';

        for (let squad of event.squadList) {
            slotListMessage += '\n\n' + Squad.prototype.toString.call(squad);
        }
        return slotListMessage;
    }
}

function buildFields(event) {
    let fields = [];

    buildField(fields, 'Zeitplan', `${formatDate(event.date, event.startTime)} und dauert ${event.missionLength}`);
    buildField(fields, 'Missionstyp', event.missionType, true);
    buildField(fields, 'Karte', event.map, true);
    buildField(fields, 'Modpack', event.modPack, true);
    buildField(fields, 'Kann die Reserve mitspielen?', event.reserveParticipating ? 'Ja' : 'Nein');
    buildField(fields, 'Missionszeit', event.missionTime, true);
    buildField(fields, 'Navigation', event.navigation, true);
    buildField(fields, 'Medicsystem', event.medicalSystem, true);
    buildField(fields, 'Technischer Teleport', event.technicalTeleport, true);

    return fields;
}

function buildField(fields, name, value, inline) {
    if (value && value !== '') {
        fields.push({
            name: name,
            value: value,
            inline: inline
        });
    }
}

function formatDate(date, time) {
    //We need to format our self, because node doesn't come with locale support to use 'date.toLocaleString('de-DE')'
    let dateObject = new Date(date);
    const timeSplit = time.split(':');
    dateObject.setHours(timeSplit[0]);
    dateObject.setMinutes(timeSplit[1]);

    return `${leadingZero(dateObject.getDate())}.${leadingZero(dateObject.getMonth() + 1)}.${dateObject.getFullYear()} ${leadingZero(dateObject.getHours())}:${leadingZero(dateObject.getMinutes())} Uhr`;
}

function leadingZero(number) {
    return ('0' + number).slice(-2);
}

function getRandomColor() {
    //May be removed in future. But signals an update during development
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

module.exports = EventPrint;