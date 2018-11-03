import {UnauthorizedError} from "./error";

export default class Api {
	constructor(url) {
		this.url = url;
		this.session_token = "";
	}
	
	setSessionToken(session_token) {
		this.session_token = session_token;
	}
	
	call(endpoint, method) {
		if (endpoint == "auth" || this.session_token != "") {
			// Do API call.
			return {};
		} else {
			throw new UnauthorizedError(`Unauthorized ${method} to ${this.url}${endpoint}.`);
		}
	}
}
