import {UnauthorizedError} from "./error";

export default class Api {
	constructor(url) {
		this.url = url;
		this.sessionToken = "";
	}
	
	/**
	* Makes an API call. When authenticating, session key returned will be 
	* stored and used in other calls. Authenticate first before making other 
	* API calls.
	* @param {string} endpoint The endpoint to send the request to. 
	* @param {string} method HTTP request method.
	* @return {object} JSON response.
	*/
	call(endpoint, method) {
		if (endpoint == "auth" || this.sessionToken != "") {
			// Do API call.
			console.log(`Successful ${method} to ${this.url}${endpoint}.`);
			
			if (endpoint == "auth" && method == "POST") {
				this.sessionToken = "dummySessionToken123";
				return {sessionToken: "dummySessionToken123"};
			}
			
			return {};
		} else {
			throw new UnauthorizedError(`Unauthorized ${method} to ${this.url}${endpoint}.`);
		}
	}
}
