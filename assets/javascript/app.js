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
$("#add-train-btn").on("click", addToDatabase);

function addToDatabase() {
	event.preventDefault();

	//get form input
	var trainName = $("#train-name").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrain = $("#first-train").val().trim();
	var freq = $("#frequency").val().trim();

	//temp trainData
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
};


//database to html
database.ref().on("child_added", function(snapshot, prevChildKey) {


	//console.log(snapshot.val());

	var trainName = snapshot.val().trainName;
	var destination = snapshot.val().destination;
	var firstTrain = snapshot.val().firstTrain;
	var freq = snapshot.val().freq; 

	//var remAndNext = trainLogic(firstTrain, freq);	
	var nextArrival = "00:00"; //remAndNext[1];
	var remainder = 3; //remAndNext[0];

	//format time
	// if (nextArrival[0] <= 12) {
	// 	nextArrival = nextArrival[0] + ":" + nextArrival[1] + " AM";
	// }
	// else {
	// 	nextArrival = nextArrival[1]-12 + ":" + nextArrival[1] + " PM";
	// };
	moment(nextArrival).format("hh:mm:ss A");

	//add to table
	$("#train-schedule-table > tbody").append("<tr><td>" + trainName + "</td>" +
												"<td>" + destination + "</td>" +
												"<td>" + freq + "</td>" +
												"<td>" + nextArrival + "</td>" +
												"<td>" + remainder + "</td></tr>");


});


//next train time
function trainLogic(first, freq) {
	var currentTime = moment().format("hh:mm");
	currentTime.splice(":");
	first.splice(":");

	var currentTimeInMin = currentTime[0]*60 + currentTime[1];
	var firstInMin = first[0]*60 + first[1];
	var remainder = 0;
	var nextArrival = currentTime;

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
		nextArrival = [currentTime[0], currentTime[1]+(freq - remainder)];
	};

	return [remainder, nextArrival];
}; 





}); 


