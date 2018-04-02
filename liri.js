
var Util = require("./util.js")


//Node arguments
var command = process.argv[2];
var value;

//Process commands
switch (command) {
    case "my-tweets":
        Util.myTweets();
        break;
    case "spotify-this-song":
        value = typeof (process.argv[3]) === 'undefined' ? 'The Sign' : process.argv[3];
        Util.spotifySong(value);
        break;

    case "movie-this":
        value = typeof (process.argv[3]) === 'undefined' ? 'Mr. Nobody.' : process.argv[3];
        Util.movieInfo(value);
        break;

    case "do-what-it-says":
        Util.doWhatItSays();
        break;

    default:
        break;
}

