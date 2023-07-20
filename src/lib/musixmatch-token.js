const axios = require("axios");

class MusixmatchToken {
    constructor () {
        this.tokenLink = "https://apic.musixmatch.com/ws/1.1/token.get?guid=12ecc059dc933fca&app_id=android-player-v1.0";
    }

    async getUserToken() {
        const response = await axios.get(this.tokenLink, {
            headers: {
                "Cookie": global.config.defaultCookies
            }
        });

        return response.data["message"]["body"]["user_token"];
    }
}

module.exports = new MusixmatchToken();