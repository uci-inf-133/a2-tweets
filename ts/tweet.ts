class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.

        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }
        else if (this.text.startsWith("Achieved") || this.text.includes("set a goal")) {
            return "achievement";
        }
        else if (this.text.startsWith("Watch") || this.text.includes("right now")) {
            return "live_event";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        return !this.text.includes("Check it out!");
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }

        let removeTag = this.text.replace(" #Runkeeper", '');
        const indexOfLink = removeTag.lastIndexOf(" ");
        let strippedTweet = removeTag;
        if (indexOfLink !== -1) {
            strippedTweet = strippedTweet.slice(0, indexOfLink);
        }
        const indexOfBeginText = strippedTweet.indexOf("-");
        return strippedTweet.slice(indexOfBeginText + 1, strippedTweet.length);
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet

        const indexOfBeginActivity = this.text.indexOf("a");
        let indexOfEndActivity;

        if(this.written){
            indexOfEndActivity = this.text.indexOf("-");
        }
        else{
            indexOfEndActivity = this.text.indexOf("with");
        }

        let dataString = this.text;

        dataString = dataString.slice(indexOfBeginActivity, indexOfEndActivity-1);
        let indexOfActivity;
        let activity = "";
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
        //TODO: prase the distance from the text of the tweet

        const indexOfBeginDistance = this.text.indexOf("a");
        let indexOfEndDistance;

        if(this.written){
            indexOfEndDistance = this.text.indexOf("-");
        }
        else{
            indexOfEndDistance = this.text.indexOf("with");
        }

        let dataString = this.text;

        dataString = dataString.slice(indexOfBeginDistance+2, indexOfEndDistance-1).trim();
        // console.log(dataString)

        let indexOfDistance;
        let distanceString = "";
        let distance = 0;
        if(dataString.includes("in")){
            indexOfDistance = dataString.lastIndexOf(" ");

            // distanceString = dataString.slice(indexOfDistance + 1, dataString.length).trim();
            // console.log(distanceString)
            return distance;
        }
        else{
            indexOfDistance = distanceString.lastIndexOf(" ");
            dataString = dataString.slice(0, indexOfDistance);
            // console.log(dataString)
            const splitDistanceString = dataString.split(" ");
            // console.log("SPLIT DISTANCE STRING")
            // console.log(splitDistanceString[0])
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

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}