
//import { Twitter } from "./keys";
var DotEnv = require("dotenv").config();
var Keys = require("./keys.js");
var Request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var _ = require("underscore");




var twitterClient = new Twitter(Keys.twitter);
var spotifyClient = new Spotify(Keys.spotify);



var command = process.argv[2];
var value = typeof(process.argv[3]) === 'undefined'?'Mr. Nobody.':process.argv[3];

switch (command) {
    case "my-tweets":
        twitterClient.get("statuses/user_timeline", function (error, tweets, response) {
            if (error) throw error;
            console.log(tweets);

        })

        break;
    case "spotify-this-song":

        spotifyClient.search({ type: 'track', query: value }, function (err, response) {
            if (err) {
                return console.log('Error occurred : ' + err)
            }
            console.log(response.tracks.items[0].name);
            console.log(response.tracks.items[0].preview_url);
            console.log(response.tracks.items[0].artists[0].name);

        })



        break;

    case "movie-this":

        var queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy";

        Request(queryUrl, function (error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {

                var ratings = JSON.parse(body).Ratings;

                var rottenTomatoesRatings = _.where(ratings, { Source: 'Rotten Tomatoes' });
               // console.log(rottenTomatoesRatings);
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

        break;

        case "do-what-it-says":
        break;

    default:
        break;
}

