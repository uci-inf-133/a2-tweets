function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	let tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	let frequentActivity = {};
	let activityStats = {};
	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	}
	let complete = 0;

	for(let i = 0; i < tweet_array.length; i++){
		if(tweet_array[i].source === "completed_event"){
			activityStats[complete] = {
				activity: tweet_array[i].activityType,
				dist: tweet_array[i].distance,
				date: tweet_array[i].time.toLocaleDateString("en-US", options)
			}
			complete++;

			if(tweet_array[i].activityType in frequentActivity){
				frequentActivity[tweet_array[i].activityType]++;
			}
			else{
				frequentActivity[tweet_array[i].activityType] = 1;
			}
		}
	}

	//https://www.educative.io/answers/how-can-we-sort-a-dictionary-by-value-in-javascript
	let sortDictionary = Object.keys(frequentActivity).map((key) => {return [key, frequentActivity[key]]});
	sortDictionary.sort((activity1, activity2)=>{
		return activity1[1] - activity2[1];
	});

	document.getElementById('numberActivities').innerText = sortDictionary.length.toString();
	document.getElementById('firstMost').innerText = sortDictionary[sortDictionary.length-1][0];
	document.getElementById('secondMost').innerText = sortDictionary[sortDictionary.length-2][0];
	document.getElementById('thirdMost').innerText = sortDictionary[sortDictionary.length-3][0];

	// console.log(activityStats)

	let avgDistance1 = 0.0;
	let avgDistance2 = 0.0;
	let avgDistance3 = 0.0;

	let weekdays = 0;
	let numWeekdayWorkouts = 0;
	let weekDayArr = ["Mon", "Tue", "Wed", "Thu", "Fri"];

	let weekends = 0;
	let numWeekendWorkouts = 0;

	let topThreeData = [];

	for(const j in activityStats){
		if((activityStats[j].activity === sortDictionary[sortDictionary.length-1][0]) || (activityStats[j].activity  === sortDictionary[sortDictionary.length-2][0])
			|| (activityStats[j].activity === sortDictionary[sortDictionary.length-3][0])){

			if(activityStats[j].activity === sortDictionary[sortDictionary.length-1][0]) {
				avgDistance1 += activityStats[j].dist;
			}
			else if(activityStats[j].activity  === sortDictionary[sortDictionary.length-2][0]){
				avgDistance2 += activityStats[j].dist;
			}
			else if(activityStats[j].activity === sortDictionary[sortDictionary.length-3][0]){
				avgDistance3 += activityStats[j].dist;
			}


			if(activityStats[j].date.includes("Sat") || activityStats[j].date.includes("Sun")){
				weekends += activityStats[j].dist;
				numWeekendWorkouts++;

				if(activityStats[j].date.includes("Sat")){
					topThreeData.push({"distance": activityStats[j].dist, "time (day)": "Sat", "activity": activityStats[j].activity})
				}
				else if(activityStats[j].date.includes("Sun")){
					topThreeData.push({"distance": activityStats[j].dist, "time (day)": "Sun", "activity": activityStats[j].activity})
				}
			}
			else{
				for(let m = 0; m < weekDayArr.length; m++){
					if(activityStats[j].date.includes(weekDayArr[m])){
						weekdays += activityStats[j].dist;
						numWeekdayWorkouts++;
						topThreeData.push({"distance": activityStats[j].dist, "time (day)": weekDayArr[m], "activity": activityStats[j].activity})
					}
				}
			}
		}
	}
	avgDistance1 = avgDistance1/sortDictionary[sortDictionary.length-1][1];
	avgDistance2 = avgDistance2/sortDictionary[sortDictionary.length-2][1];
	avgDistance3 = avgDistance3/sortDictionary[sortDictionary.length-3][1];

	let sortActDist = [[avgDistance1,sortDictionary[sortDictionary.length-1][0]], [avgDistance2,sortDictionary[sortDictionary.length-2][0]], [avgDistance3,sortDictionary[sortDictionary.length-3][0]]];
	sortActDist.sort((num1, num2) =>{
		return num2[0]-num1[0];
	});

	document.getElementById('longestActivityType').innerText = sortActDist[0][1];
	document.getElementById('shortestActivityType').innerText = sortActDist[2][1];

	weekdays = weekdays/numWeekdayWorkouts;
	weekends = weekends/numWeekendWorkouts;

	// console.log(topThreeData)

	let longestActivityDates;

	if(weekends > weekdays){
		longestActivityDates = "weekends";
	}
	else{
		longestActivityDates = "weekdays";
	}

	document.getElementById('weekdayOrWeekendLonger').innerText = longestActivityDates;

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	let frequentActivityData = [];
	for(const n in frequentActivity){
		frequentActivityData.push({"Activities": n, "Tweets": frequentActivity[n]})
	}

	// console.log(frequentActivityData)

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": frequentActivityData
		},
		"mark": "point",
		"encoding": {
			"x": {"field": "Activities", "type": "nominal"},
			"y": {"field": "Tweets", "type": "quantitative"}
		},
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of distance by day of the week of the top three most popular activities.",
		"data": {
			"values": topThreeData
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "time (day)",
				"type": "ordinal",
				"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
			},
			"y": {"field": "distance", "type": "quantitative"},
			"color": {"field": "activity", "type": "nominal"}
		},
	};

	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	distance_vis_aggre = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of distance by day of the week of the top three most popular activities.",
		"data": {
			"values": topThreeData
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "time (day)",
				"type": "ordinal",
				"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
			},
			"y": {"aggregate": "mean", "field": "distance"},
			"color": {"field": "activity", "type": "nominal"}
		},
	};

	const distanceVis = document.getElementById("distanceVis");
	const distanceAggregate = document.getElementById("distanceVisAggregated");
	distanceAggregate.style.display = "none";
	vegaEmbed('#distanceVisAggregated', distance_vis_aggre, {actions:false});

	const aggregateButton = document.getElementById("aggregate");

	aggregateButton.addEventListener("click", () => {
		if(distanceVis.style.display === "none"){
			distanceVis.style.display = "block";
			distanceAggregate.style.display = "none";
		}
		else{
			distanceVis.style.display = "none";
			distanceAggregate.style.display = "block";
		}
	})
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});