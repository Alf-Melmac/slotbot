module.exports = {
    name: 'role',
    description: 'Nur fürs Testen relevant. Gibt dir die Rolle, die als Parameter übergeben wurde oder nimmt sie dir weg',
    argCount: [1],
    usage: '<Rolle>',
    authorizedRoles: ['@everyone'],
    dmAllowed: false,
    execute(message, args) {
        let roles = message.member.roles;
        switch (args[0].toLowerCase()) {
            case 'administrator':
                let roleAdmin = message.guild.roles.cache.find(role => role.name === 'Administrator');
                PermissionHelper.authorHasRole(message, 'Administrator') ? roles.remove(roleAdmin) : roles.add(roleAdmin);
                break;
            case 'moderator':
                let roleMod = message.guild.roles.cache.find(role => role.name === 'Moderator');
                PermissionHelper.authorHasRole(message, 'Moderator') ? roles.remove(roleMod) : roles.add(roleMod);
                break;
            case 'creator':
                let roleCr = message.guild.roles.cache.find(role => role.name === 'Creator');
                PermissionHelper.authorHasRole(message, 'Creator') ? roles.remove(roleCr) : roles.add(roleCr);
                break;
            case 'arma':
                let roleAr = message.guild.roles.cache.find(role => role.name === 'ArmA');
                PermissionHelper.authorHasRole(message, 'ArmA') ? roles.remove(roleAr) : roles.add(roleAr);
                break;
        }

        MessageHelper.deleteMessages(message);
    }
};