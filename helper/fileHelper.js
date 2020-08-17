const fs = require('fs');

class FileHelper {
    static getJsFiles(path) {
        return fs.readdirSync(path).filter(file => file.endsWith('.js'));
    }

    static getCommandFilesInCategory(category) {
        return this.getJsFiles(`./commands/${category}`).map(file => `${category}/${file}`);
    }
}

module.exports = FileHelper;