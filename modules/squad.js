const Slot = require('../modules/slot');

class Squad {
    constructor(name, slotList, event) {
        this.name = name;
        this.slotList = slotList;
        this.event = event;
    }

    toString() {
        let str = `**${this.name}**`;
        for (let slot of this.slotList) {
            //Needed to call a method from a object, because no casting is available
            str += '\n' + Slot.prototype.toString.call(slot);
        }
        return str;
    }
}

module.exports = Squad;