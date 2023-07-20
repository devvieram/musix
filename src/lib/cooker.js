const fs = require("fs");

class Cooker { 
    constructor() {
        this.offset = 0;
    }

    cookMetadata() {}

    async cookJsonLyrics(richsync_body) {
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

async function writeToFile(name, format, content) {
    await fs.writeFile(`output/${global.trackInfo.track_name}_${name}.${format}`, JSON.stringify(content), (err) => { if (err) throw err; })
}