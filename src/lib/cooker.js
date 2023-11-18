const fs = require("fs");
const { parse } = require("clrc");

class Cooker { 
    constructor() {}

    async cookMetadata (trackInfo) {
        try {
            var cookedTrackInfo = {
                title: trackInfo["track_name"],
                artist: trackInfo["artist_name"],
                from_the_album: trackInfo["album_name"],
                release_date: trackInfo["first_release_date"],
                explicit: (trackInfo["explicit"] == 1) ? true : false,
                genres: [],
                length: {
                    readable: secondsToTime(trackInfo["track_length"]),
                    seconds: trackInfo["track_length"]
                },
                links: {
                }
            };

            if (trackInfo["primary_genres"]["music_genre_list"].length !== 0) {
                cookedTrackInfo["genres"].push(trackInfo["primary_genres"]["music_genre_list"][0]["music_genre"]["music_genre_name"])
            }

            if (trackInfo["secondary_genres"]["music_genre_list"].length !== 0) {
                cookedTrackInfo["genres"].push(trackInfo["primary_genres"]["music_genre_list"][0]["music_genre"]["music_genre_name"])
            }

            if (trackInfo["track_spotify_id"]) {
                cookedTrackInfo["links"]["spotify"] = `https:\/\/open.spotify.com\/track\/${trackInfo["track_spotify_id"]}`;
            }

            if (trackInfo["track_share_url"]) {
                cookedTrackInfo["links"]["musixmatch"] = trackInfo["track_share_url"].split("\?")[0]
            }
    
            await writeToFile("metadata", "json", cookedTrackInfo);
    
            return cookedTrackInfo;
        } catch (e) {
            throw new Error(e)
        }
    }

    async cookLRCLyrics (subtitles_body) {
        try {
            if (typeof subtitles_body !== "string") throw Error("Something happened! subtitles_body did not return a string.");

            var cookedLyrics = [];

            var parsedData = await parse(subtitles_body);

            for (var i = 0; i < parsedData.length; i++) {
                var { startMillisecond, content } = parsedData[i];

                if (!parsedData[i+1]) {
                    if (content.trim() === "") continue;
                }

                cookedLyrics.push({
                    "time": Math.round(startMillisecond),
                    "duration": Math.round(parsedData[i+1].startMillisecond - startMillisecond),
                    "text": content.trim(),
                    "isLineEnding": 1
                })

            }

            await writeToFile("subtitles", "json", cookedLyrics);

            return cookedLyrics;
        } catch (e) {
            throw new Error(e)
        }
    }

    async cookRichLyrics (richsync_body) {
        try {
            if (!Array.isArray(richsync_body)) throw Error("Something happened! richsync_body did not return an array.");
        
            var cookedLyrics = [];

            for (var h = 0; h < richsync_body.length; h++ ) {

                var { l, te, ts } = richsync_body[h];
                var te = parseTime(te);
                var ts = parseTime(ts);

                for (var i = 0; i < l.length; i++) {
                    // If there's no more strings left in the lyrics line
                    if (!l[i + 1]) {
                        cookedLyrics.push({
                            "time": Math.round(ts + parseTime(l[i].o)),
                            "duration": Math.round(te - (ts + parseTime(l[i].o))),
                            "text": l[i].c,
                            "isLineEnding": 1
                        })
                        continue;
                    }

                    // If there are strings left in the lyric line
                    cookedLyrics.push({
                        "time": ts + parseTime(l[i].o),
                        "duration": parseTime(l[i + 1].o) - parseTime(l[i].o),
                        "text": l[i].c + l[i + 1].c,
                        "isLineEnding": (l[i + 2] ? 0 : 1)
                    })

                    i++;
                }
            }

            await writeToFile("richsync", "json", cookedLyrics);

            return cookedLyrics;
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = new Cooker();


function parseTime(float) {
    return parseFloat((float * 1000).toFixed(0).replace('.', ''));
}

function secondsToTime(seconds) {
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function writeToFile(name, format, content) {
    await fs.writeFile(
        `output/${global.trackInfo.track_name.replace(/[\\/:"*?<>|]/g, '_')}_${name}.${format}`, 
        JSON.stringify(content, null, 2), 
        (err) => { if (err) throw err; }
    )
}

