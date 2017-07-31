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

database.ref().on("child_added", databaseToHTML);


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

function databaseToHTML(snapshot, prevChildKey) {
	//console.log(snapshot.val());

	var trainName = snapshot.val().trainName;
	var destination = snapshot.val().destination;
	var firstTrain = snapshot.val().firstTrain;
	var freq = snapshot.val().freq; 
	
	var remainder; 
	var nextArrival;


	[remainder, nextArrival] = trainLogic(firstTrain, freq);	

	//format time
	if (nextArrival[1] < 10) {
		nextArrival[1] = "0" + nextArrival[1];
	};

	if (nextArrival[0] <= 12) {
		nextArrival = nextArrival[0] + ":" + nextArrival[1] + " AM";
	}
	else {
		nextArrival = nextArrival[0] + ":" + nextArrival[1] + " PM";
	}
	// nextArrival = nextArrival[0] + ":" + nextArrival[1];
	// console.log(nextArrival);
	// nextArrival = moment(nextArrival).format("hh:mm A");
	// console.log(nextArrival);

	//add to table
	$("#train-schedule-table > tbody").append("<tr><td>" + trainName + "</td>" +
												"<td>" + destination + "</td>" +
												"<td>" + freq + "</td>" +
												"<td>" + nextArrival + "</td>" +
												"<td>" + remainder + "</td></tr>");


};


//next train time
function trainLogic(firstTrain, freq) {
	var currentTime = moment().format("HH:mm");
	currentTime = currentTime.split(":");
	currentTime = [ parseInt(currentTime[0]), parseInt(currentTime[1]) ];
	firstTrain = firstTrain.split(":");
	firstTrain = [ parseInt(firstTrain[0]), parseInt(firstTrain[1]) ];

	//convert time to minutes
	var currentTimeMin = currentTime[0]*60 + currentTime[1];
	var firstTrainMin = firstTrain[0]*60 + firstTrain[1];

	var remainder = 0;
	var nextArrival = currentTime;

	//find remainder
	if (firstTrainMin > currentTimeMin) {
		remainder = (firstTrainMin + 24*60 - currentTimeMin) % freq;
	}
	else if (firstTrainMin < currentTimeMin){
		remainder = (currentTimeMin - firstTrainMin) % freq;
	}
	// no change if firstTrainMin === currentTrainMin

	var nextArrivalMin = currentTime[0] + remainder;
	var freqMinusRem = freq - remainder;

	if (remainder === 0) {
		remainder = "Arriving";
		return [remainder, nextArrival];
	};

	if (nextArrivalMin < 60) {
		nextArrival = [ currentTime[0],	currentTime[1]+freqMinusRem ];	

	}
	else if (nextArrivalMin > 60) {
		nextArrival = [ currentTime[0]+1, currentTime[1]+freqMinusRem-60 ];
	};	
	
	return [remainder, nextArrival];
}; 

}); 


