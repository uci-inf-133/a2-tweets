function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	let tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//get earliest and latest Tweet by sorting tweet array by time in ascending order
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
	tweet_array.sort((tweet1, tweet2) => {

		//turn time into ISO time and use parse to get time in milliseconds
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
		let time1 = Date.parse(tweet1.time.toISOString());
		let time2 = Date.parse(tweet2.time.toISOString())

		if(time1 < time2){
			return -1;
		}

		if(time1 > time2){
			return 1;
		}

		//if equal
		return 0;
	})

	console.log(tweet_array[0].writtenText)

	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	}

	const earliestTweet = tweet_array[0].time.toLocaleDateString("en-US", options)
	const latestTweet = tweet_array[tweet_array.length-1].time.toLocaleDateString("en-US", options)

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;
	document.getElementById('firstDate').innerText = earliestTweet;
	document.getElementById('lastDate').innerText = latestTweet;

	let completedEvents = 0;
	let liveEvents = 0;
	let achievements = 0;
	let misc = 0;
	let completedArr = []

	for(let i = 0; i < tweet_array.length; i++){
		if(tweet_array[i].source === "completed_event"){
			completedArr.push(tweet_array[i])
			completedEvents++;
		}
		else if(tweet_array[i].source === "achievement"){
			achievements++;
		}
		else if(tweet_array[i].source === "live_event"){
			liveEvents++;
		}
		else{
			misc++;
		}
	}

	document.getElementsByClassName('completedEvents')[0].innerText = completedEvents;
	document.getElementsByClassName('completedEventsPct')[0].innerText = ((completedEvents/tweet_array.length)*100).toFixed(2).toString() + "%";
	document.getElementsByClassName('liveEvents')[0].innerText = liveEvents;
	document.getElementsByClassName('liveEventsPct')[0].innerText = ((liveEvents/tweet_array.length)*100).toFixed(2).toString() + "%";
	document.getElementsByClassName('achievements')[0].innerText = achievements;
	document.getElementsByClassName('achievementsPct')[0].innerText = ((achievements/tweet_array.length)*100).toFixed(2).toString() + "%";
	document.getElementsByClassName('miscellaneous')[0].innerText = misc;
	document.getElementsByClassName('miscellaneousPct')[0].innerText = ((misc/tweet_array.length)*100).toFixed(2).toString() + "%";

	let userTextEvents = 0;
	for(let j = 0; j < completedArr.length; j++){
		if (completedArr[j].written){
			userTextEvents++;
		}
	}

	document.getElementsByClassName('completedEvents')[1].innerText = completedArr.length;
	document.getElementsByClassName('written')[0].innerText = userTextEvents;
	document.getElementsByClassName('writtenPct')[0].innerText = ((userTextEvents/completedArr.length)*100).toFixed(2).toString() + "%";

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});