const Event = require('../../modules/event');
const EventUpdate = require('../../helper/eventUpdate');

module.exports = {
    name: 'renameslot',
    description: 'Ermöglicht es einen Slot umzubenennen',
    argCount: [2],
    aliases: ['editslot'],
    usage: '<Slotnummer> "<Slotname>"',
    authorizedRoles: PermissionHelper.getEventManageRoles(),
    dmAllowed: false,
    execute(message, args) {
        logger.debug('Command: renameSlot');

        let slotName = args[1].trim();
        if(slotName.startsWith('"') && slotName.endsWith('"')) {
            //Removes the enclosing quote
            slotName = slotName.replace(/^"|"$/g, '');
        }

        Event.renameSlot(message, args[0], slotName, event => EventUpdate.updateWithGivenEvent(message, event));
    }
};