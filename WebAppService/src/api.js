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
	getBlock(id) {
		return this.call(`blocks/${id}`, "GET", {});
	}
	postBlock(block) {
		// id is given in block, to edit slots postSlots
		let body = {
			id: block.id,
			author: block.author,
			courseCodes: block.courseCodes,
			comment: block.comment,
			startTime: block.startTime,
			slotDuration: block.slotDuration
		};
		return this.call(`blocks/${id}`, "POST", body);
	}
	deleteBlock(id) {
		return this.call(`blocks/${id}`, "DELETE");
	}
	
	getSlots(id) {
		return this.call(`blocks/${id}/slots`, "GET", {});
	}
	postSlots(id, slots) {
		return this.call(`blocks/${id}/slots`, "POST", slots);
	}
	getSlot(id, index) {
		return this.call(`blocks/${id}/slots/${index}`, "GET", {});
	}
	postSlot(id, index, slot) {
		let body = {
			utorId: slot.utorId,
			note: slot.note
		};
		return this.call(`blocks/${id}/slots/${index}`, "POST", body);
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
