const fetch = require("node-fetch");
require('dotenv').config()

const NearSocial = {
    generateApiPostRequest: function (endpoint, token, data, api_version) {
        api_version = api_version || 1;

        const fetchInit = {
            method: 'POST',
            headers: this.generateApiHeaders(token),
            body: this.generateApiBody(data)
        }

        console.log(`Status: ${data.status}`);

        return fetch(this.getApiUrl(endpoint, api_version), fetchInit).then(res => res.json());
    },

    generateApiHeaders: function (token) {
        const headers = new fetch.Headers();
        headers.set('Authorization', 'Bearer ' + token);
        return headers;
    },

    generateApiBody: function (data) {
        const body = new URLSearchParams()
        for (let key in data) {
            body.set(key, data[key])
        }
        return body;
    },

    getApiUrl: function (endpoint, api_version) {
        if (api_version === 1) {
            endpoint = process.env.NEAR_SOCIAL_SERVER_API_V1 + endpoint;
        }
        return endpoint;
    }
}


module.exports = NearSocial;