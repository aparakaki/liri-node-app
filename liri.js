require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var moment = require('moment');
var fs = require("fs");
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

// console.log(spotify);

// var option = process.argv[2];
// var userInput = process.argv.splice(3).join(" ");
var dataToSave = "";
var s = "-----------------------------------------------------------------------------------------------\r\n\r\n";

inquirer.prompt([
    {
        type: "list",
        name: "userChoice",
        message: "What would you like to do?",
        choices: ["Get venue info", "Get song info", "Get movie info", "Read from file"]
    }
])
.then(function(answer) {
    // console.log(answer)
    switch(answer.userChoice) {
    case "Get venue info":
        inquirer.prompt([{
            name: "artist",
            message: "Enter artist: "
        }]).then(function(ans) {
            userInput = ans.artist;
            dataToSave += answer.userChoice + ": " + userInput + "\r\n";
            getVenueInfo();
        })
        break;

    case "Get song info":
        inquirer.prompt([{
            name: "song",
            message: "Enter song title: "
        }]).then(function(ans) {
            userInput = ans.song;
            dataToSave += answer.userChoice + ": " + userInput + "\r\n";
            getSongInfo();
        })
        break;
     
    case "Get movie info":
        inquirer.prompt([{
            name: "movie",
            message: "Enter movie title: "
        }]).then(function(ans) {
            userInput = ans.movie;
            dataToSave += answer.userChoice + ": " + userInput + "\r\n";
            getMovieInfo();
        })
        break;

    default:            // do-what-it-says
        fs.readFile("random.txt", "utf8", function(error, data) {
            option = data.split(",")[0];
            userInput = data.split(",")[1];
            // console.log(option);
            // console.log(userInput)
            dataToSave += data + "\r\n";
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
})

// switch(option) {
//     case "concert-this":
//         getVenueInfo();
//         break;

//     case "spotify-this-song":
//         getSongInfo();
//         break;
     
//     case "movie-this":
//         getMovieInfo();
//         break;

//     default:            // do-what-it-says
//         fs.readFile("random.txt", "utf8", function(error, data) {
//             option = data.split(",")[0];
//             userInput = data.split(",")[1];
//             // console.log(option);
//             // console.log(userInput)

//             switch(option) {
//                 case "concert-this":
//                     getVenueInfo();
//                     break;
//                 case "spotify-this-song":
//                     getSongInfo();
//                     break;
     
//                 case "movie-this":
//                     getMovieInfo();
//                     break;
//             }
//         })
//         break;
// }

function getVenueInfo() {
    request("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp", function(error, response, body) {
        // console.log(JSON.stringify(response, null, 2));
        var events = JSON.parse(body);
        if (events.length === 0) {
            dataToSave += "No events found for this artist.\r\n";
            // console.log("No events found for this artist.")
        }
        else {
            for (var i = 0; i< events.length; i++) {
                dataToSave += "Venue: " + events[i].venue.name + "\r\n";
                // console.log("Venue: " + events[i].venue.name);
                if (events[i].venue.country === "United States") {
                    dataToSave += "Location: " + events[i].venue.city + ", " + events[i].venue.region + "\r\n";
                    // console.log("Location: " + events[i].venue.city + ", " + events[i].venue.region);  
                }
                else {
                    dataToSave += "Location: " + events[i].venue.city + ", " + events[i].venue.country + "\r\n";
                    // console.log("Location: " + events[i].venue.city + ", " + events[i].venue.country);
                }
                dataToSave += "Time: " + moment(events[i].datetime).format("MM/DD/YYYY") + "\r\n\r\n"
                // console.log("Time: " + moment(events[i].datetime).format("MM/DD/YYYY") + "\r\n");    
            }
        }
        console.log(dataToSave);
        dataToSave += s;
        saveInfo(dataToSave);
    })
}

function getMovieInfo() {
    if (userInput === "") {
        userInput = "Mr. Nobody"
        dataToSave += "* If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/ \r\n" +
        "* It's on Netflix!\r\n"
        console.log(dataToSave);
        dataToSave += s;
        saveInfo(dataToSave);
        // console.log("* If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        // console.log("* It's on Netflix!");
    }
    else {
        request("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
            var info = JSON.parse(body);
            // console.log(info);
            dataToSave += "* Title: " + info.Title + "\r\n" 
                        + "* Year: " + info.Year + "\r\n"
                        + "* IMDB Rating: " + info.imdbRating + "\r\n";
            // console.log("* Title: " + info.Title);
            // console.log("* Year: " + info.Year);
            // console.log("* IMDB Rating: " + info.imdbRating);
            for (var i = 0; i < info.Ratings.length; i++) {
                if (info.Ratings[i].Source === "Rotten Tomatoes") {
                    dataToSave += "* Rotten Tomatoes Rating: " + info.Ratings[i].Value + "\r\n";
                    // console.log("* Rotten Tomatoes Rating: " + info.Ratings[i].Value);
                }
                // else {
                //     console.log("No Rotten Tomatoes Rating available");
                // }
            }
            dataToSave += "* Country: " + info.Country + "\r\n"
                        + "* Language: " + info.Language + "\r\n"
                        + "* Plot: " + info.Plot + "\r\n"
                        + "* Actors: " + info.Actors + "\r\n";
            // console.log("* Country: " + info.Country);
            // console.log("* Language: " + info.Language);
            // console.log("* Plot: " + info.Plot);
            // console.log("* Actors: " + info.Actors);
            console.log(dataToSave);
            dataToSave += s;
            saveInfo(dataToSave);
        })
    }
}

function getSongInfo() {
    spotify.search({ type: 'track', query: userInput, limit: 1}, function(error, data) {
        // console.log(data);
        var obj = data.tracks.items[0];
        // console.log(obj);
        dataToSave += "* Artist: " + obj.artists[0].name + "\r\n" 
                    + "* Song: " + obj.name + "\r\n"
                    + "* Album: " + obj.album.name + "\r\n";
        // console.log("* Artist: " + obj.artists[0].name);
        // console.log("* Song: " + obj.name);
        // console.log("* Album: " + obj.album.name);
        if(obj.preview_url !== null) {
            dataToSave += "* Song Preview: " + obj.preview_url + "\r\n";
            // console.log("* Song Preview: " + obj.preview_url);  
        }
        else {
            dataToSave += "No song preview available\r\n";
            // console.log("No song preview available")
        }
        console.log(dataToSave);
        dataToSave += s;
        saveInfo(dataToSave);
    })
}

function saveInfo(data) {
    fs.appendFile("log.txt", data, function(error){})
}