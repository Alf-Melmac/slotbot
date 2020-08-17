const roleAdministrator = 'Administrator';
const roleModerator = 'Moderator';
const roleCreator = 'Creator';
const roleGamer = 'Gamer';

class PermissionHelper {
    static authorHasRole(message, roleNeeded) {
        return message.member.roles.cache.some(role => role.name === roleNeeded);
    }

    static authorHasAtLeastOneOfRoles(message, roleNames) {
        if (!roleNames || MessageHelper.isDm(message)) {
            return MessageHelper.replyAndDelete(message, 'Das darfst du hier nicht.');
        }
        return message.member.roles.cache.some(role => roleNames.find((roleInArray) => role.name === roleInArray));
    }

    static hasSlotRole(message) {
        return this.authorHasAtLeastOneOfRoles(message, this.getSlotRoles());
    }

    static hasEventManageRole(message) {
        return this.authorHasAtLeastOneOfRoles(message, this.getEventManageRoles());
    }

    static hasAdministrativeFunction(message) {
        return this.authorHasAtLeastOneOfRoles(message, this.getAdministrativeRoles());
    }

    static getAdministrativeRoles() {
        return [roleAdministrator, roleModerator];
    }

    static getEventManageRoles() {
        return [roleCreator].concat(this.getAdministrativeRoles());
    }

    static getSlotRoles() {
        return [roleGamer];
    }

}

module.exports = PermissionHelper;