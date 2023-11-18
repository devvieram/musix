const async = require("async");

// Load configuration stuff before showing the main screen!
async.waterfall([
    require("./lib/configuration").init
], function(err, results) {
    
    (async () => {
        await require("./lib/screens").init()
    })();
})

