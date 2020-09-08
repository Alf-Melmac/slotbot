const fetch = require("node-fetch");

class Request {
    static async GET(url) {
        return await fetch(url, {
            method: 'GET'
        });
    }

    static async POST(url, body) {
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }

    static async PUT(url, body) {
        return await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }

    static async DELETE(url) {
        return await fetch(url, {
            method: 'DELETE'
        });
    }
}

module.exports = Request;