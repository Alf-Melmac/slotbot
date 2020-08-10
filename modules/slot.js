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
}

module.exports = Slot;