import {UnauthorizedError} from "./error";

export default class Api {
	constructor(url) {
		this.url = url;
		this.sessionToken = "";
	}
	
	/**
	* Makes an API call. When authenticating, session key returned will be 
	* stored and used in other calls. Authenticate first before making other 
	* API calls. Header is exclusively for authentication.
	* @param {string} path The path to send the request to, appended to url. 
	* @param {string} method HTTP request method.
	* @param {object} body HTTP request body.
	* @return {object} JSON response.
	*/
	call(path, method, body) {
		if (path == "auth" || this.sessionToken != "") {
			// Do API call.
			console.log(`Successful ${method} to ${this.url}${path}.`);
			
			if (path == "auth" && method == "POST") {
				this.sessionToken = "dummySessionToken123";
				return {sessionToken: "dummySessionToken123"};
			}
			
			return {};
		} else {
			throw new UnauthorizedError(`Unauthorized ${method} to ${this.url}${path}.`);
		}
	}
}
