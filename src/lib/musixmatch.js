const axios = require("axios");

var baseURL = "https://apic-desktop.musixmatch.com/ws/1.1/";

class Musixmatch {
    constructor () {}

    async searchByName (q_artist, q_track, q_album = "") {
        const result = await _get("track.search", {
            q_track, q_artist, q_album
        });

        return result;
    }

    async searchByTrackId (track_id) {
        const result = await _get("matcher.track.get", {
            track_id
        });

        return result;
    }

    async getRichLyrics (track_id) {
        const result = await _get("track.richsync.get", {
            track_id
        });

        return JSON.parse(result["richsync"]["richsync_body"]);
    }

    async getLRCSubtitles (track_id) {
        const result = await _get("track.subtitle.get", {
            track_id
        });

        return result["subtitle"]["subtitle_body"];
    }

    async getSongMetadata (track_id) {
        const result = await _get("track.get", {
            track_id
        });

        return result["track"];
    }
}

// Request MusixMatch API.
async function _get(method, params) {
    // Perform request
    try {
        const response = await axios.get(baseURL + method, {
            params: {
                ...global.config.defaultParams,
                ...params
            },
            headers: {
                Cookie: global.config.defaultCookies
            }
        });

        /*
        //var VALID_STATUS_CODES = [200, 201, 202];
        var status_code = response.data["message"]["header"]["status_code"];

        if (!(status_code in [200, 201, 202])) throw new Error(response.data);

        if (status_code == 401 && response.data['message']['header']['hint'] === "captcha") throw new Error("Captcha is required.")
        else if (status_code != 200) return null;
        */

        return response.data["message"]["body"];
    } catch (e) {
        console.error(e)
    }
}

module.exports = new Musixmatch();