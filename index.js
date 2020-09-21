//Discord setup
const Discord = require('discord.js');
client = new Discord.Client();
client.commands = new Discord.Collection();

//Logging
const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');
logger = winston.createLogger({
    transports: [
        new winston.transports.Console({level: 'debug'}),
        new winston.transports.DailyRotateFile({
            level: 'info',
            name: 'file',
            datePattern: 'DD-MM-yyyy',
            filename: path.join(__dirname, 'logs', 'slotbot_%DATE%.log'),
            maxFiles: '14d'
        })
    ],
    format: winston.format.printf(log => `[${new Date().toLocaleString('de-DE')} ${log.level.toUpperCase()}] - ${log.message}`)
});

//Config
const {prefix, token} = require('./config.json');

//Make the helper classes publicly available
PermissionHelper = require('./helper/permissionHelper');
MessageHelper = require('./helper/messageHelper');

//Build command list
const FileHelper = require('./helper/fileHelper');
const commandFiles = FileHelper.getJsFiles('./commands')
    .concat(FileHelper.getCommandFilesInCategory('event'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//Bot start
client.login(token).then(() => logger.info('Logged in'));
client.once('ready', () => {
    logger.info('Bot ready');
});

//Message handling
client.on('message', message => {
    //Ignore message without prefix or from other bots
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    logger.debug(`Received command: ${message} from ${message.author.id}`);

    let args = message.content.slice(prefix.length);
    //Only split, if message isn't in JSON format
    if (!args.toLowerCase().startsWith('eventjson')) {
        //Split on spaces except in quotes
        args = args.match(/(?:[^\s"]+|"[^"]*")+/g);
        args.forEach(function (item, i) {
                let arg = item.trim();
                if (arg.startsWith('"') && arg.endsWith('"')) {
                    //Removes the enclosing quotes
                    arg = arg.replace(/^"|"$/g, '');
                }
                args[i] = arg;
            }
        );
    } else {
        //For these special commands everything after the command is handled as one argument. Validation and potential splitting must be done by the position called up
        const indexOfCommandEnd = args.indexOf(' ');
        args = [args.substring(0, indexOfCommandEnd), args.substring(indexOfCommandEnd + 1)];
    }
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    //Exit if command doesn't exist
    if (!command) return;

    if (!command.argCount.includes(args.length)) {
        logger.debug(`${args.length} arguments received. Expected ${command.argCount}`);
        let reply = `Das ist die falsche Anzahl Argumente!`;
        if (command.usage) {
            reply += `\nSo funktioniert der Befehl: \`${prefix}${command.name} ${command.usage}\``;
        }
        MessageHelper.sendDmAndDeleteMessage(message, reply);
        return;
    } else if (command.authorizedRoles) {
        if (!(command.dmAllowed && MessageHelper.isDm(message))) {
            if (!PermissionHelper.authorHasAtLeastOneOfRoles(message, command.authorizedRoles)) {
                MessageHelper.replyAndDelete(message, 'Das darfst du hier nicht.');
                return;
            }
        }
    }

    try {
        command.execute(message, args);
    } catch (error) {
        logger.error(error);
        MessageHelper.replyAndDelete(message, 'Tja, da ist wohl was schief gelaufen.');
    }
});