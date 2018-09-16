require("dotenv").config();
var request = require("request");
var moment = require('moment');
var fs = require("fs");
var Spotify = require("node-spotify-api");

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// console.log(spotify);

var option = process.argv[2];
var userInput = process.argv.splice(3).join(" ");

if (option === "do-what-it-says") {
    console.log("if loop")
    fs.readFile("random.txt", "utf8", function(error, data) {
        option = data.split(",")[0];
        userInput = data.split(",")[1];
        console.log("1" +option);
    })
    console.log("2" +option);
}

switch(option) {
    case "concert-this":
        request("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp", function(error, response, body) {
            // console.log(JSON.stringify(response, null, 2));
            var events = JSON.parse(body);
            if (events.length === 0) {
                console.log("No events found for this artist.")
            }
            else {
                for (var i = 0; i< events.length; i++) {
                    console.log("Venue: " + events[i].venue.name);
                    if (events[i].venue.country === "United States") {
                        console.log("Location: " + events[i].venue.city + ", " + events[i].venue.region);  
                    }
                    else {
                        console.log("Location: " + events[i].venue.city + ", " + events[i].venue.country);
                    }
                    console.log("Time: " + moment(events[i].datetime).format("MM/DD/YYYY") + "\r\n");    
                }
            }
        })
        break;

    case "spotify-this-song":
    break;
     
    case "movie-this":
        if (userInput === "") {
            userInput = "Mr. Nobody"
            console.log("* If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("* It's on Netflix!");
        }
        else {
            request("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
                var info = JSON.parse(body);
                console.log("* Title: " + info.Title);
                console.log("* Year: " + info.Year);
                console.log("* IMDB Rating: " + info.imdbRatings);
                for (var i = 0; i < info.Ratings.length; i++) {
                    if (info.Ratings[i].Source === "Rotten Tomatoes") {
                        console.log("* Rotten Tomatoes Rating: " + info.Ratings[i].Value);
                    }
                    // else {
                    //     console.log("No Rotten Tomatoes Rating available");
                    // }
                }
                console.log("* Country: " + info.Country);
                console.log("* Language: " + info.Language);
                console.log("* Plot: " + info.Plot);
                console.log("* Actors: " + info.Actors);
            })
        }
        break;

    default:            // do-what-it-says
    break;
}

