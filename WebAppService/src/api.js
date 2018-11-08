import {UnauthorizedError} from "./error";

export default class Api {
	constructor(url) {
		this.url = url;
		this.sessionToken = "";
	}
	
	authenticate(username, password) {
		this.call("auth", "POST", {username: username, password: password});
		this.sessionToken = "dummySessionToken123";
		return {sessionToken: "dummySessionToken123"};
	}
	
	getBlocks(utorId) {
		return this.call(`blocks/${utorId}`, "GET", {});
	}
	getBlock(utorId, startTime) {
		return this.call(`blocks/${utorId}/${startTime}`, "GET", {});
	}
	postBlock(utorId, startTime, block) {
		return this.call(`blocks/${utorId}/${startTime}`, "POST", block);
	}
	deleteBlock(utorId, startTime, block) {
		return this.call(`blocks/${utorId}/${startTime}`, "POST", block);
	}
	
	getSlots(utorId, startTime) {
		return this.call(`blocks/${utorId}/${startTime}/slots`, "GET", {});
	}
	getSlot(utorId, startTime, index) {
		return this.call(`blocks/${utorId}/${startTime}/slots/${index}`, "GET", {});
	}
	postSlot(utorId, startTime, index, slot) {
		return this.call(`blocks/${utorId}/${startTime}/slots/${index}`, "POST", slot);
	}
	
	/**
	* Makes an API call. Authenticate first before making other 
	* API calls. Header is exclusively for authenticating requests.
	* @param {string} path The path to send the request to, appended to url. 
	* @param {string} method HTTP request method.
	* @param {object} body HTTP request body.
	* @return {object} JSON response.
	*/
	call(path, method, body) {
		if (path == "auth" || this.sessionToken) {
			let header = {};
			if (path != "auth") {
				header = {Authorization: `Basic ${this.sessionToken}`};
			}
			
			// TODO: Do API call, throw error if unsuccessful.
			
			console.log(`Successful ${method} to ${this.url}${path}.`);
			return {};
		} else {
			throw new UnauthorizedError(`Unauthorized ${method} to ${this.url}${path}.`);
		}
	}
}
