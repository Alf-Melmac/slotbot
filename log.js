module.exports = {
    init() {
        const path = require('path');
        const winston = require('winston');
        require('winston-daily-rotate-file');

        global.logger = winston.createLogger({
            transports: [
                new winston.transports.Console({level: 'debug'}),
                new winston.transports.DailyRotateFile({
                    level: 'info',
                    name: 'file',
                    datePattern: 'DD-MM-yyyy',
                    filename: path.join(__dirname, 'logs', 'slotbot_%DATE%.log'),
                    maxFiles: '14d'
                })
            ],
            format: winston.format.printf(log => `[${new Date().toLocaleString('de-DE')} ${log.level.toUpperCase()}] - ${log.message}`)
        });
    }
}