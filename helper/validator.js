class Validator {
    static date(date) {
        return !date.match('([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))');
    }

    static time(time) {
        return !time.match('^([0-2][0-3]|[0-1][0-9]):[0-5][0-9]+$');
    }

    static isUserMention(s) {
        //For 17 or 18 digits we can assume that it is a Discord User ID
        return /^<@!?\d{17,18}>$/.test(s);
    }

    static onlyNumbers(s) {
        return /\D/.test(s);
    }
}

module.exports = Validator;