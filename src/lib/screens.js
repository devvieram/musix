const fs = require("fs");
const chalk = require("chalk");
const inquirer = require("inquirer");
const readline = require("readline");

const Musixmatch = require("./musixmatch");
const Cooker = require("./cooker");

class Screens {
    constructor () {}

    async init () {
        global.trackInfo = {};
        console.clear();

        // Create output folder if it does not exist
        if (!fs.existsSync("./output")) fs.mkdirSync("./output", { recursive: true });

        console.log(`welcome to ${chalk.bold("musix")}, a tool made by ${chalk.cyan("devvie")}!`);
        console.log(`an app that turns ${chalk.bold("musixmatch")} lyrics into a ${chalk.bold("just dance")} format.\n`)

        inquirer.prompt([
            {
                type: "list",
                prefix: "",
                message: "what would you like to get?",
                name: "screens",
                choices: [
                    "synced lyrics",
                    "lrc lyrics",
                    "song metadata"
                ]
            }
        ]).then(async(response) => {

            switch (response["screens"]) {
                case "synced lyrics":
                    await this.richSync();
                    break;
                case "lrc lyrics":
                    await this.LRC();
                    break;
                case "song metadata":
                    await this.metadata();
            }

        })
    }

    async richSync () {
        inquirer.prompt([
            {
                type: "input",
                prefix: "",
                message: "what's the artist name:",
                name: "artist"
            },
            {
                type: "input",
                prefix: "",
                message: "what's the song:",
                name: "track"
            },
            {
                type: "input",
                prefix: "",
                message: "what's the album (optional):",
                name: "album"
            }
        ]).then(async(responses) => {
            const searchResults = await Musixmatch.searchByName(
                responses["artist"], responses["track"], responses["album"]
            );
            
            var richsyncResults = searchResults["track_list"].filter(track => track?.track.has_richsync == 1);
            
            // no rich sync results
            if (richsyncResults.length == 0) {
                console.log("\ncouldn't find any synced lyrics with the search info.\ntry again with different/more info,\notherwise there's no synced lyrics available.");
                await PETC("\npress enter to go back to the main menu.");

                return this.init();
            }
            
            var richsyncChoices = [];

            richsyncResults.forEach(track => {
                track = track["track"];

                richsyncChoices.push(`${track["artist_name"]} — ${track["track_name"]} • ${parseSeconds(track["track_length"])} • ${track["album_name"]} ${(track["explicit"] == 1) ? "[Explicit]" : ""}`)
            })

            // select song from search result
            inquirer.prompt([
                {
                    type: "list",
                    prefix: "",
                    message: "which is the song that you're looking for?",
                    name: "richsyncChoice",
                    choices: richsyncChoices
                }
            ]).then(async(result) => {
                var richsyncChoice = result["richsyncChoice"]

                var choiceNumber = richsyncChoices.indexOf(richsyncChoice);

                var { track } = richsyncResults[choiceNumber];

                global.trackInfo = track;

                var richSyncLyrics = await Musixmatch.getRichLyrics(track["track_id"]);

                const offset = await this.askOffset();

                await Cooker.cookRichLyrics(richSyncLyrics, offset);

                console.log(`\ncooked lyrics for \"${track["track_name"]}\"!\nhave fun! :)`);

                await PETC("\npress enter to go back to the main menu.");
                return this.init();
            })
        })
    }

    async LRC () {
        inquirer.prompt([
            {
                type: "input",
                prefix: "",
                message: "what's the artist name:",
                name: "artist"
            },
            {
                type: "input",
                prefix: "",
                message: "what's the song:",
                name: "track"
            },
            {
                type: "input",
                prefix: "",
                message: "what's the album (optional):",
                name: "album"
            }
        ]).then(async(responses) => {
            const searchResults = await Musixmatch.searchByName(
                responses["artist"], responses["track"], responses["album"]
            )
            
            var subtitlesResults = searchResults["track_list"].filter(track => track?.track.has_subtitles == 1);
            
            if (subtitlesResults.length == 0) {
                console.log("\ncouldn't find any subtitles with the search info.\ntry again with different/more info,\notherwise there's no subtitles available.");
                await PETC("\npress enter to go back to the main menu.");

                return this.init();
            }
            
            var subtitlesChoices = [];

            subtitlesResults.forEach(track => {
                track = track["track"];

                subtitlesChoices.push(`${track["artist_name"]} — ${track["track_name"]} • ${parseSeconds(track["track_length"])} • ${track["album_name"]} ${(track["explicit"] == 1) ? "[Explicit]" : ""}`)
            })

            inquirer.prompt([
                {
                    type: "list",
                    prefix: "",
                    message: "which is the song that you're looking for?",
                    name: "subtitlesChoice",
                    choices: subtitlesChoices
                }
            ]).then(async(result) => {
                var subtitlesChoice = result["subtitlesChoice"]

                var choiceNumber = subtitlesChoices.indexOf(subtitlesChoice);

                var { track } = subtitlesResults[choiceNumber];

                global.trackInfo = track;

                var subtitleLyrics = await Musixmatch.getLRCSubtitles(track["track_id"]);

                const offset = await this.askOffset();

                await Cooker.cookLRCLyrics(subtitleLyrics, offset);

                console.log(`\ncooked subtitles for \"${track["track_name"]}\"!\nhave fun! :)`);

                await PETC("\npress enter to go back to the main menu.");
                return this.init();
            })
        })
    }

    async metadata () {
        inquirer.prompt([
            {
                type: "input",
                prefix: "",
                message: "what's the artist name:",
                name: "artist"
            },
            {
                type: "input",
                prefix: "",
                message: "what's the song:",
                name: "track"
            },
            {
                type: "input",
                prefix: "",
                message: "what's the album (optional):",
                name: "album"
            }
        ]).then(async(responses) => {
            const searchResults = await Musixmatch.searchByName(
                responses["artist"], responses["track"], responses["album"]
            )
            
            if (searchResults["track_list"].length == 0) {
                console.log("\ncouldn't find any songs with the search info.\ntry again with different/more info,\notherwise there's no songs available.");
                await PETC("\npress enter to go back to the main menu.");

                return this.init();
            }

            var metadataChoices = [];
            
            searchResults["track_list"].forEach(track => {
                track = track["track"];

                metadataChoices.push(`${track["artist_name"]} — ${track["track_name"]} • ${parseSeconds(track["track_length"])} • ${track["album_name"]} ${(track["explicit"] == 1) ? "[Explicit]" : ""}`)
            })

            inquirer.prompt([
                {
                    type: "list",
                    prefix: "",
                    message: "which is the song that you're looking for?",
                    name: "metadataChoice",
                    choices: metadataChoices
                }
            ]).then(async(result) => {
                var metadataChoice = result["metadataChoice"]

                var choiceNumber = metadataChoices.indexOf(metadataChoice);

                var { track } = searchResults["track_list"][choiceNumber];

                global.trackInfo = track;

                var trackInfo = await Musixmatch.getSongMetadata(track["track_id"]);

                await Cooker.cookMetadata(trackInfo);

                console.log(`\ncooked metadata for \"${track["track_name"]}\"!\nhave fun! :)`);

                await PETC("\npress enter to go back to the main menu.");
                return this.init();
            })
        })
    }

    async askOffset() {
        var fixedOffset = 0;

        await inquirer.prompt([
            {
                type: "confirm",
                prefix: "",
                message: "do you want to adjust the offset?",
                name: "adjustOffset"
            }
        ]).then(async(result) => {
            var adjustOffset = result["adjustOffset"]
            if (!adjustOffset) return 0;
            
            // if yes ask for offset
            await inquirer.prompt([
                {
                    type: "string",
                    prefix: "",
                    message: "enter the start of first lyric (in ms or MM:SS.MS) format (e.g: 4504 or 00:04.504)",
                    name: "offset"
                }
            ]).then(async(result) => {
                var offset = result["offset"];
    
                if (offset.includes(':')) {
                    // if the offset is in MM:SS.MS format
                    const parts = offset.split(':');
                    const minutes = parseInt(parts[0], 10);
                    const secondsAndMS = parts[1].split('.') || 0;
                    const seconds = parseInt(secondsAndMS[0], 10);
                    const milliseconds = parseInt(secondsAndMS[1], 10) || 0;
            
                    fixedOffset =  minutes * 60 * 1000 + seconds * 1000 + milliseconds;
                } else {
                    // if the offset is in pure milliseconds format
                    fixedOffset = parseInt(offset);
                };
                console.log("offset set as:", fixedOffset)
            });
        });

        return fixedOffset;
    };
}

module.exports = new Screens();

// Press Enter To Continue
async function PETC(message) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question(message, () => {
            rl.close();
            resolve();
        });
    });
}

function parseSeconds(trackLength) {
  return `${String(Math.floor(trackLength / 60)).padStart(2, '0')}:${String(trackLength % 60).padStart(2, '0')}`;
}