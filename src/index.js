const async = require("async");

// Load configuration stuff before showing the main screen!
async.waterfall([
    require("./lib/configuration").init
], function(err, results) {
    
    (async () => {
        await require("./lib/screens").init()
        /*
        const result = await require("./lib/musixmatch").searchByName("NewJeans", "New Jeans");

        global.trackInfo = result["track"];

        const lyricsResult = await require("./lib/musixmatch").getRichLyrics(global.trackInfo["track_id"]);

        var richsync_body = JSON.parse(lyricsResult["richsync"]["richsync_body"]);

        const lyrics = await require("./lib/cooker").cookJsonLyrics(richsync_body)
        console.log(lyrics)
        */
    })();
})

