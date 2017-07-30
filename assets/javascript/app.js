$(document).ready(function(){

// Initialize Firebase
var config = {
	apiKey: "AIzaSyCWlCHe2B5ew8Bu6OuuMYqmngH562QTuS0",
    authDomain: "trainscheduler-25b5a.firebaseapp.com",
    databaseURL: "https://trainscheduler-25b5a.firebaseio.com",
    projectId: "trainscheduler-25b5a",
    storageBucket: "",
    messagingSenderId: "517729294510"
};
firebase.initializeApp(config);

var database = firebase.database();

//store data
$("#add-train-btn").on("click", function(event) {
	event.preventDefault();

	//get form input
	var trainName = $("#train-name").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrain = $("#first-train").val().trim();
	var freq = $("#frequency").val().trim();

	//temp object w trainData
	var newTrain = {
		trainName: trainName,
		destination: destination,
		firstTrain: firstTrain,
		freq: freq,
	};

	database.ref().push(newTrain);

	alert("Train successfully added");

	//clear form
	$("#train-name").val("");
	$("#destination").val("");
	$("#first-train").val("");
	$("#frequency").val("");
});





//next train time
function trainLogic(first, freq) {
	var currentTime = moment().format("hh:mm");
	currentTime.splice(":");
	first.splice(":");

	var currentTimeInMin = currentTime[0]*60 + currentTime[1];
	var firstInMin = first[0]*60 + first[1];
	var remainder = 0;
	var nextArival = currentTime;

	//find remainder
	if (firstInMin > currentTimeInMin) {
		remainder = (firstInMin - currentTimeInMin) % freq;
		console.log(currentTime[0]);
		// var currFreq = frequency - remainder;
		// currFreq += currentTime[1];

		nextArrival = [currentTime[0], currentTime[1] + (freq - remainder) ];
	}
	else if (firstInMin === currentTimeInMin) {
		//nothing
	}
	else if (firstInMin < currentTimeInMin){
		remainder = (currentTimeInMin + 24*60 - firstInMin) % freq;
		nextArival = [currentTime[0], currentTime[1]+(freq - remainder)];
	};

	return [remainder, nextArival];
};





})


