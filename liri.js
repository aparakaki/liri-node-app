require("dotenv").config();
var request = require("request");
var moment = require('moment');
var Spotify = require("node-spotify-api");

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// console.log(spotify);

var option = process.argv[2];
var userInput = process.argv.splice(3).join(" ");

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
    break;

    default:            // do-what-it-says
    break;
}

