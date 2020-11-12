const User = require('../modules/user');
const slotRequest = require("./rest/slotRequest");

class Slot {
    constructor(name, number, squad, user, replacementText) {
        this.name = name;
        this.number = number;
        this.squad = squad;
        this.user = user;
        this.replacementText = replacementText;
    }

    static objToSlot(obj) {
        obj && Object.assign(this, obj);
    }

    toString() {
        let str = '';
        const isEmpty = !!!this.user;
        if (isEmpty) {
            str += '**';
        }
        str += `${this.number} ${this.name}`;
        if (isEmpty) {
            str += '**';
        }
        str += ': ';

        const isBlocked = this.user && this.user.id === User.defaultUserId;
        if (this.user && this.user.id && !isBlocked) {
            str += `**<@${this.user.id}>**`;
        } else if (isBlocked) {
            str += `*${this.replacementText}*`;
        }
        return str;
    }

    static swap(message, slots, callback) {
        slotRequest.putSwapRequest(slots)
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