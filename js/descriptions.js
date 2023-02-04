let runnerTweets;
function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//default is "0 tweets contain the text ''"
	document.getElementById('searchCount').innerText = "0";
	document.getElementById('searchText').innerText = "";

	//put tweets into array of tweet objects for parsing
	let tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//filter tweets to get only tweets that contain human written text
	const tweets = tweet_array.filter((tweet)=>{
		return tweet.written;
	});

	//filter any tweets where human typed text is " "
	const writtenTweets = tweets.filter((tweet)=>{
		return tweet.writtenText !== "";
	})

	//parse tweets to get all the info we need for displaying row and removing row
	runnerTweets = writtenTweets.map((tweet, index)=>{
		const newRow = tweet.getHTMLTableRow(index+1); //get table element
		return {activity: tweet.activityType, text: tweet.writtenText, rowElem: newRow, id: index+1}
	})

	//set event handler
	addEventHandlerForSearch();
}

function addEventHandlerForSearch() {
	//get search element
	const searchElement = document.getElementById("textFilter");

	//add event handler for search element
	searchElement.addEventListener("input", (e) => {
		//get parent element for table
		const tweetTable = document.getElementById("tweetTable");

		//get value typed in search box (search text)
		let userSearch = e.target.value.toLowerCase();

		//counter to keep track of tweets that contain search text
		let tweetNum = 0;

		//if search text is not empty string
		if(userSearch !== "") {
			//look through tweets and display them if they match user search
			runnerTweets.forEach((tweet) => {
				const isActivityMatch = tweet.activity.includes(userSearch);
				const isTextMatch = tweet.text.toLowerCase().includes(userSearch);

				//if tweet text or activity matches search text
				if (isTextMatch || isActivityMatch) {
					//add the tweet to the table with current tweetNumber as row number
					tweetNum++;
					const rowNumElem = tweet.rowElem.firstChild;
					rowNumElem.textContent = tweetNum.toString();
					tweetTable.appendChild(tweet.rowElem);
				} else {
					//if tweet doesn't match user search, remove it from the table
					const removeTweet = document.getElementById(tweet.id); //find tweet in table through its id
					if (removeTweet) {
						removeTweet.remove();
					}
				}
			})

			//set search count and search text
			document.getElementById('searchCount').innerText = tweetNum.toString();
			document.getElementById('searchText').innerText = userSearch;
		}
		//if search text is empty string
		else{
			//revert to default
			tweetTable.innerHTML = "";
			document.getElementById('searchCount').innerText = "0";
			document.getElementById('searchText').innerText = userSearch;
		}

	})
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});