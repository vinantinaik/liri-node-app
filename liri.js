
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


//Node arguments
var command = process.argv[2];
var value;

//Process commands
switch (command) {
    case "my-tweets":
        twitterClient.get("statuses/user_timeline", function (error, tweets, response) {
            if (error) throw error;

            for (var i = 0; i < tweets.length; i++) {
                console.log(`${i} Tweet : ${tweets[i].text} Created at: ${tweets[i].created_at}`);
            }
        })

        break;
    case "spotify-this-song":
        value = typeof (process.argv[3]) === 'undefined' ? 'The Sign' : process.argv[3];

        spotifyClient.search({ type: 'track', query: value }, function (err, response) {
            if (err) {
                return console.log('Error occurred : ' + err)
            }
            
            var data=response.tracks.items;
            for (var i = 0; i < data.length; i++) {
               
                console.log(`Album: ${data[i].album.name}`);
                console.log(`Name: ${data[i].name}`);
                console.log(`Preview: ${data[i].preview_url}`);
                console.log("Artists : ");
                data[i].artists.forEach(element => {
                                 console.log(`${ element.name}`)
                });
                console.log();
            }


        })



        break;

    case "movie-this":
        value = typeof (process.argv[3]) === 'undefined' ? 'Mr. Nobody.' : process.argv[3];
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
        FS.readFile("./random.txt", "utf8", function (error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            }

            // We will then print the contents of data
            console.log(data);

            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");

            // We will then re-display the content as an array for later use.
            console.log(dataArr);

        });
        break;

    default:
        break;
}

