require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var moment = require('moment');
var fs = require("fs");
var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

// console.log(spotify);

var option = process.argv[2];
var userInput = process.argv.splice(3).join(" ");
var dataToSave = "";

switch(option) {
    case "concert-this":
        getVenueInfo();
        break;

    case "spotify-this-song":
        getSongInfo();
        break;
     
    case "movie-this":
        getMovieInfo();
        break;

    default:            // do-what-it-says
        fs.readFile("random.txt", "utf8", function(error, data) {
            option = data.split(",")[0];
            userInput = data.split(",")[1];
            // console.log(option);
            // console.log(userInput)

            switch(option) {
                case "concert-this":
                    getVenueInfo();
                    break;
                case "spotify-this-song":
                    getSongInfo();
                    break;
     
                case "movie-this":
                    getMovieInfo();
                    break;
            }
        })
        break;
}

function getVenueInfo() {
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
}

function getMovieInfo() {
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
                else {
                    console.log("No Rotten Tomatoes Rating available");
                }
            }
            console.log("* Country: " + info.Country);
            console.log("* Language: " + info.Language);
            console.log("* Plot: " + info.Plot);
            console.log("* Actors: " + info.Actors);
        })
    }
}

function getSongInfo() {
    spotify.search({ type: 'track', query: userInput, limit: 1}, function(error, data) {
        // console.log(data);
        var obj = data.tracks.items[0];
        // console.log(obj);
        console.log("* Artist: " + obj.artists[0].name);
        console.log("* Song: " + obj.name);
        console.log("* Album: " + obj.album.name);
        if(obj.preview_url !== null) {
            console.log("* Song Preview: " + obj.preview_url);  
        }
        else {
            console.log("No song preview available")
        }
    })
}

function saveInfo(data) {
    fs.appendFile("log.txt", data, function(error){})
}