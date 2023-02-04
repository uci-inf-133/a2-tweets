class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //return "completed_event" if the tweet has the phrases "just completed" or "just posted"
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }
        //return "achievement" if the tweet has the phrase "Achieved"
        else if (this.text.startsWith("Achieved") || this.text.includes("set a goal")) {
            return "achievement";
        }
        //return "live_event" if the tweet has the phrases "Watch" or "right now"
        else if (this.text.startsWith("Watch") || this.text.includes("right now")) {
            return "live_event";
        }
        //else return "miscellaneous"
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //if tweet is a live event, it does not include human typed text
        if(this.text.startsWith("Watch my")){
            return false
        }
        //if tweet does not have the phrase "Check it out!", it is a human typed tweet
        return !this.text.includes("Check it out!");
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }

        //split the text from the link
        const splitTweet = this.text.split("https");
        let strippedTweet = splitTweet[0]; //first element contains written text

        //get rid of the "just posted" and "just completed" text, which is not human typed text
        const indexOfBeginText = strippedTweet.indexOf("-");
        let cleanedTweet = strippedTweet.slice(indexOfBeginText + 1, strippedTweet.length).trim();
        cleanedTweet = cleanedTweet.replace(" Runkeeper", ""); //remove Runkeeper tag if it still remains

        //return parsed human text
        return cleanedTweet;
    }

    get activityType():string {
        //return unknown if not a completed_event
        if (this.source != 'completed_event') {
            return "unknown";
        }

        //find "a"
        const indexOfBeginActivity = this.text.indexOf("a");
        let indexOfEndActivity;

        //if the text includes text written by person
        if(this.written){
            //find "-"
            indexOfEndActivity = this.text.indexOf("-");
        }
        else{
            //find "with"
            indexOfEndActivity = this.text.indexOf("with");
        }

        //slice the text to get the text between "a" and "-" or "a" and "with"
        let dataString = this.text;
        dataString = dataString.slice(indexOfBeginActivity, indexOfEndActivity-1);
        let indexOfActivity;
        let activity = "";

        //handle special "dance" activity case
        if(dataString.includes("in")){
            indexOfActivity = dataString.lastIndexOf("in");
            if(dataString.includes("dance")){
                activity = "dance";
            }
            else if(dataString.includes("an")){
                activity = dataString.slice(3, indexOfActivity-1).trim();
            }
            else{
                activity = dataString.slice(1, indexOfActivity-1).trim();
            }
        }
        else{
            //take out the distance from string to get only activity
            if(dataString.includes("km")){
                indexOfActivity = dataString.indexOf("km");
            }
            else{
                indexOfActivity = dataString.lastIndexOf("mi");
            }
            activity = dataString.slice(indexOfActivity+3, dataString.length);
        }

        return activity.trim();
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        //find a
        const indexOfBeginDistance = this.text.indexOf("a");
        let indexOfEndDistance;

        //if the text includes text written by person
        if(this.written){
            //find "-"
            indexOfEndDistance = this.text.indexOf("-");
        }
        else{
            //find "with"
            indexOfEndDistance = this.text.indexOf("with");
        }

        //slice the text to get the text between "a" and "-" or "a" and "with"
        let dataString = this.text;
        dataString = dataString.slice(indexOfBeginDistance+2, indexOfEndDistance-1).trim();

        let indexOfDistance;
        let distanceString = "";
        let distance = 0;
        //handle case where there is no distance, only time
        if(dataString.includes("in")){
            return distance;
        }
        else{
            //get distance and convert to miles if needed
            indexOfDistance = distanceString.lastIndexOf(" ");
            dataString = dataString.slice(0, indexOfDistance);
            const splitDistanceString = dataString.split(" ");
            distance = Number(splitDistanceString[0]);
            if(isNaN(distance)){
                return 0;
            }
            if(splitDistanceString[1] == "km"){
                distance = distance/1.609;
            }
        }

        return distance;
    }

    getHTMLTableRow(rowNumber:number):HTMLTableRowElement {
        //create tr element
        const newRow = document.createElement("tr");
        newRow.setAttribute("id", rowNumber.toString()); //give the element an id (row number is id)

        //create td element for row and give it a row number
        const rowNum = document.createElement("td");
        const rowText = document.createTextNode(rowNumber.toString());
        rowNum.appendChild(rowText);

        //create a td element for activity and assign activity
        const activityType = document.createElement("td");
        const activityText = document.createTextNode(this.activityType);
        activityType.appendChild(activityText);

        //parse text to get the links
        //remove non-human typed parts
        const indexOfBeginText = this.text.indexOf("-");
        const writtenTweet = this.text.slice(indexOfBeginText + 1, this.text.length).trim()

        //remove tags
        let removeTags = writtenTweet.replace(" #Runkeeper", '');
        removeTags = removeTags.replace(" #FitnessAlerts", "");

        //split text on links
        const htmlLinks = removeTags.split("https");

        let aTags = [];
        //get the links and create an <a> tag for each link + add it to array
        for(let i = 1; i< htmlLinks.length; i++){
            const link = " https" + htmlLinks[i];
            const aTag = document.createElement("a");
            aTag.setAttribute('href', link);
            aTag.innerHTML = link;
            aTags.push(aTag);
        }

        //create td element for written text
        const tweetMsg = document.createElement("td");
        const tweetMsgText =  document.createTextNode(this.writtenText);
        tweetMsg.appendChild(tweetMsgText);

        //append each link to text element
        for(let i = 0; i < aTags.length; i++){
            tweetMsg.appendChild(aTags[i]);
        }

        //create elements to add tags back in the text
        let tags;
        if(writtenTweet.includes("#FitnessAlerts")){
            tags = document.createTextNode(" #FitnessAlerts")
            tweetMsg.appendChild(tags)
        }
        else{
            tags = document.createTextNode(" #Runkeeper")
            tweetMsg.appendChild(tags)
        }

        //add everything into the tr parent element
        newRow.appendChild(rowNum);
        newRow.append(activityType);
        newRow.append(tweetMsg);

        return newRow;
    }
}