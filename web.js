module.exports = {
    init() {
        //Express setup
        const express = require('express');
        let app = express();

        const api = '/slotbot/api';
        app.all('*', require('./routes/tokenAuth')); //Validate api token for every request
        app.use(`${api}/status`, require('./routes/status'));

        const {port} = require('./config.json');
        app.listen(port, function () {
            logger.info(`Listening to port ${port}`);
        });
    }
}

