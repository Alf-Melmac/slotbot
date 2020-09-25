const fetch = require("node-fetch");
const {slotbotAuthTokenName, slotbotAuthToken} = require('../config.json');

class Request {
    static async GET(url) {
        return await fetch(url, {
            method: 'GET',
            headers: {
                [slotbotAuthTokenName]: slotbotAuthToken
            }
        });
    }

    static async POST(url, body) {
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [slotbotAuthTokenName]: slotbotAuthToken
            },
            body: JSON.stringify(body)
        });
    }

    static async PUT(url, body) {
        return await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                [slotbotAuthTokenName]: slotbotAuthToken
            },
            body: JSON.stringify(body)
        });
    }

    static async DELETE(url) {
        return await fetch(url, {
            method: 'DELETE',
            headers: {
                [slotbotAuthTokenName]: slotbotAuthToken
            }
        });
    }
}

module.exports = Request;