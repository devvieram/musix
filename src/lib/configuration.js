const MusixmatchToken = require("./musixmatch-token");

class Configuration {
    constructor () {}

    async init () {
        global.config = {
            defaultParams: {
                app_id: "android-player-v1.0",
                format: "json"
            },
            defaultCookies: "mxm-encrypted-token=;x-mxm-token-guid=undefined;x-mxm-user-id=undefined;AWSELB=0;AWSELBCORS=0"
        };

        global.config.defaultParams.usertoken = await MusixmatchToken.getUserToken();
    }
}

module.exports = new Configuration();