class Validator {
    static date(date) {
        return !date.match('([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))');
    }

    static time(time) {
        return !time.match('^([0-2][0-3]|[0-1][0-9]):[0-5][0-9]+$');
    }

    static isUser(id) {
        //For 18 characters we can assume that it is a Discord User ID
        return Math.ceil(Math.log10(id + 1)) === 16;
    }
}

module.exports = Validator;