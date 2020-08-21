const slotRequest = require("./rest/slotRequest");

class Slot {
    constructor(name, number, squad, userId) {
        this.name = name;
        this.number = number;
        this.squad = squad;
        this.userId = userId;
    }

    static objToSlot(obj) {
        obj && Object.assign(this, obj);
    }

    toString() {
        let str = `**${this.number}** ${this.name}: `;
        if (this.userId && this.userId !== '0') {
            str += `<@${this.userId}>`;
        }
        return str;
    }

    static swap(message, slots, callback) {
        slotRequest.putSwapRequest(JSON.stringify(slots))
            .then(response => responseHandling(message, response, callback))
            .catch(reason => requestErrorHandling(reason, message));
    }
}

function responseHandling(message, response, callback) {
    response.json()
        .then(json => response.ok ? callback(json) : MessageHelper.replyAndDelete(message, json.errorMessage));
}

function requestErrorHandling(error, message) {
    logger.error(error);
    MessageHelper.replyAndDelete(message, 'Da ist wohl was schief gelaufen. Vielleicht ein ungültiger Slot?');
}

module.exports = Slot;