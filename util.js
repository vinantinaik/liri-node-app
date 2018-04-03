

//Required modules
var DotEnv = require("dotenv").config();
var Keys = require("./keys.js");
var Request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var _ = require("underscore");
var FS = require("fs");

//API Keys
var twitterClient = new Twitter(Keys.twitter);
var spotifyClient = new Spotify(Keys.spotify);



//Process commands
function ProcessCommand(command, value) {
    console.log(command + " " + value);
    switch (command) {
        case "my-tweets":
            myTweets();
            break;
        case "spotify-this-song":
            var song = typeof (value) === 'undefined' ? 'The Sign' : value;
            spotifySong(song);
            break;
        case "movie-this":
            var movie = typeof (value) === 'undefined' ? 'Mr. Nobody.' : value;
            movieInfo(movie);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            break;
    }

}

/** Get tweets*/
var myTweets = function () {
    twitterClient.get("statuses/user_timeline", function (error, tweets, response) {
        if (error) throw error;

        for (var i = 0; i < tweets.length; i++) {
            console.log(`${i} Tweet : ${tweets[i].text} Created at: ${tweets[i].created_at}`);

        }
    })

}

/** Spotify song */
var spotifySong = function (song) {
    spotifyClient.search({ type: 'track', query: song }, function (err, response) {
        if (err) {
            return console.log('Error occurred : ' + err)
        }

        var data = response.tracks.items;
        for (var i = 0; i < data.length; i++) {

            console.log(`Album: ${data[i].album.name}`);
            console.log(`Name: ${data[i].name}`);
            console.log(`Preview: ${data[i].preview_url}`);
            console.log("Artists : ");
            data[i].artists.forEach(element => {
                console.log(`${element.name}`)
            });
            console.log();
        }


    })
}

/**Get Movie Info */
var movieInfo = function (movie) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    Request(queryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            var ratings = JSON.parse(body).Ratings;
            var rottenTomatoesRatings = _.where(ratings, { Source: 'Rotten Tomatoes' });
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes rating: " + rottenTomatoesRatings[0].Value);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Actors: " + JSON.parse(body).Actors);

        }
    });
}

/** Read file and process command */
var doWhatItSays = function () {
    FS.readFile("./random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);
        for (var i = 0; i < dataArr.length; i += 2) {
            var command = dataArr[i];
            var value = dataArr[i + 1];
            ProcessCommand(command, value);

        }



    });

}

var liriLog = console.log;
console.log = function (message) {

    FS.appendFile("./log.txt", message + "\n", function (err) {

        // If an error was experienced we say it.
        if (err) {
            return liriLog(err);
        }

        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
            liriLog(message);
        }

    });
}




module.exports = {
    ProcessCommand: ProcessCommand
};
