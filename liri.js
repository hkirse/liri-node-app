// dotenv required
//npm install dotenv --save
require("dotenv").config();

// NPM module used to access Twitter API.
//npm install twitter
var Twitter = require("twitter");

// Used to access Twitter keys in local file, keys.js.
var twitterKeysFile = require("./keys.js");

// NPM module used 
//to access Spotify API.
//npm install --save node-spotify-api
//var spotify = require("spotify");

// NPM module used to access OMDB API.
var request = require("request");

// NPM module used to read the random.txt file.
var fs = require("fs");

// Output file for logs.
var filename = './log.txt';

// NPM module used for logging solution.
//var log = require('simple-node-logger').createSimpleFileLogger(filename);

// Bonus log text file
//log.setLevel('all');

// Action requested.
var action = process.argv[2];

// Optional argument to request specific information.
// Based on action type.
var argument = "";

// Controller function that determines what action is taken,
// and specific data to complete that action.
determineAction(action, argument);

// Switch operation used to determin which action to take.
function determineAction(action, argument) {

// Controls optional third argument
	argument = getThirdArgument();

	switch (action) {
		
		// Lists tweets and output "my-tweets"
		case "my-tweets": 
		myTweets();
		break;

		// Song information and output "spotify-this-song"
		case "spotify-this-song":
		
		// Song title argument
		var songTitle = argument;

        // Default to "The Sign" if no song provided
		if (songTitle === "") {
			lookupSpecificSong();

		// Else looks up song based on song title.
		} else {
			// Get song information from Spotify.
			SongInfo(songTitle);
		}
		break;

		// Gets movie information.
		case "movie-this":

		// movie title argument.
		var movieTitle = argument;

		// Default movie to "Mr. Nobody" when no movie input
		if (movieTitle === "") {
			getMovieInfo("Mr. Nobody");

		// Else looks up song based on movie title.
		} else {
			getMovieInfo(movieTitle);
		}
		break;

		// Gets text inside file, and uses it to do something.
		case "do-what-it-says": 
		doWhatItSays();
		break;
	}
}

// Returns optional third argument
// when requesting song information, include a song title.
function getThirdArgument() {

	// Stores all possible arguments in array.
	argumentArray = process.argv;

	// Loops through words in node argument.
	for (var i = 3; i < argumentArray.length; i++) {
		argument += argumentArray[i];
	}
	return argument;
}

// Function to show my last 20 tweets.
function myTweets() {
	// Passes Twitter keys into call to Twitter API.
	var client = new Twitter(twitterKeysFile.twitter);

	// Search parameters includes my tweets up to last 20 tweets;
	var params = {q: '@hkirse', count: 20};

	// Shows up to last 20 tweets
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {

	  	//Loops through tweets and prints out tweet text and creation date.
	  	for (var i = 0; i < tweets.length; i++) {
			console.log("Tweet Text: " + tweets[i].text);
	  		// var tweetText = tweets.statuses[i].text;
	  		
	  		// var tweetCreationDate = tweets.statuses[i].created_at;
	  		// logOutput("Tweet Creation Date: " + tweetCreationDate);
	  	}
	  } else {
	  	logOutput(error);
	  }
	});
}

// Calls Spotify API to retrieve song information for song title.
function SongInfo(songTitle) {

	// Calls Spotify API to retrieve a track.
	spotify.search({type: 'track', query: songTitle}, function(err, data) {
		if (err) {
			logOutput.error(err);
			return
		}

		var artistsArray = data.tracks.items[0].album.artists;

		// Array to hold artist names, when more than one artist exists for a song.
		var artistsNames = [];

		// Pushes artists for track to array.
		for (var i = 0; i < artistsArray.length; i++) {
			artistsNames.push(artistsArray[i].name);
		}

		// Converts artists array to string
		var artists = artistsNames.join(", ");

		// Prints the artist(s), track name, preview url, and album name.
		logOutput("Artist(s): " + artists);
		logOutput("Song: " + data.tracks.items[0].name)
		logOutput("Spotify Preview URL: " + data.tracks.items[0].preview_url)
		logOutput("Album Name: " + data.tracks.items[0].album.name);
	});
	
}

// When no song title provided, defaults to specific song, The Sign.
function lookupSpecificSong() {

	// Calls Spotify API to retrieve a specific track, The Sign, Ace of Base.
	spotify.lookup({type: 'track', id: '3DYVWvPh3kGwPasp7yjahc'}, function(err, data) {
		if (err) {
			logOutput.error(err);
			return
		}

		// Prints the artist, track name, preview url, and album name.
		logOutput("Artist: " + data.artists[0].name);
		logOutput("Song: " + data.name);
		logOutput("Spotify Preview URL: " + data.preview_url);
		logOutput("Album Name: " + data.album.name);
	});
}

// Passes a query URL to OMDB to retrieve movie information for movie title.
// If no movie title provided, defaults to the movie, Mr. Nobody.
function getMovieInfo(movieTitle) {

	// Can't get this to run.  API key included
	var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "?i=tt3896198&apikey=74d5aae0";

	request(queryUrl, function(error, response, body) {
	  // Correct request or error
	  if (!error && response.statusCode === 200) {
	    
	    // Parses the body of the site and recovers movie info.
	    var movie = JSON.parse(body);

	    // Prints out movie info.
	    logOutput("Movie Title: " + movie.Title);
	    logOutput("Release Year: " + movie.Year);
	    logOutput("IMDB Rating: " + movie.imdbRating);
	    logOutput("Country Produced In: " + movie.Country);
	    logOutput("Language: " + movie.Language);
	    logOutput("Plot: " + movie.Plot);
	    logOutput("Actors: " + movie.Actors);


	    logOutput("Rotten Tomatoes Rating: " + movie.Ratings[2].Value);
	    logOutput("Rotten Tomatoes URL: " + movie.tomatoURL);
	  }
	});
}

// Uses fs node package to take the text inside random.txt,
// and do something with it.
function doWhatItSays() {

	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			logOutput.error(err);
		} else {

			// Creates array with data.
			var randomArray = data.split(",");

			// Sets action to first item in array.
			action = randomArray[0];

			// Sets optional third argument to second item in array.
			argument = randomArray[1];

			// Calls main controller to do something based on action and argument.
			determineAction(action, argument);
		}
	});
}

// Logs data to the terminal and output to a text file.
function logOutput(logText) {
	log.info(logText);
	console.log(logText);
}