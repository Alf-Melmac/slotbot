class Validator {
    static date(date) {
        return !date.match('([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))');
    }

    static time(time) {
        return !time.match('^([0-2][0-3]|[0-1][0-9]):[0-5][0-9]+$');
    }
}

module.exports = Validator;