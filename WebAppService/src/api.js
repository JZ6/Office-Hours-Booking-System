export default class Api {
	constructor(url) {
		this.url = url;
		this.sessionToken;
	}
	
	initSessionToken(username, password) {
		// Special call bypassing sessionToken.
		let fetchData = {
			headers: new Headers({
				"Accept": "application/json",
				"Authorization": `Basic ${username}:${password}`.toString("base64")
			}),
			method: "GET"
		};
		let promise = fetch(`${this.url}/auth`, fetchData);
		promise.then((response) => {
			this.sessionToken = response.json().sessionToken;
		});
		return promise;
	}
	
	getIdentity(identity) {
		return this.__call("GET", `/identity/${identity}`);
	}
	
	getBlockIds(startDate, endDate) {
		return this.__call("GET", `/block?from=${startDate}&to={endDate}`);
	}
	getBlock(blockId) {
		return this.__call("GET", `/blocks/${blockId}`);
	}
	addBlock(block) {
		let body = {
			owners: block.owners,
			courseCodes: block.courseCodes,
			comment: block.comment,
			startTime: block.startTime,
			appointmentDuration: block.appointmentDuration
		};
		return this.__call("POST", "/block", body);
	}
	editBlock(blockId, block) {
		let body = {
			owners: block.owners,
			courseCodes: block.courseCodes,
			comment: block.comment,
			startTime: block.startTime,
			appointmentDuration: block.appointmentDuration
		};
		return this.__call("POST", `/blocks/${blockId}`, body);
	}
	deleteBlock(blockId) {
		return this.__call("DELETE", `/blocks/${blockId}`);
	}
	
	getSlots(blockId) {
		return this.__call("GET", `/blocks/${blockId}`).block.appointmentSlots;
	}
	editSlot(blockId, slotId, slot) {
		let body = {
			startTime: slotId,
			identity: slot.identity,
			note: slot.note
		}
		return this.__call("POST", `/blocks/${blockId}/booking`, body);
	}
	
	__call(method, path, body) {
		
		if (!this.sessionToken) {
			throw new Error("Please login first.");
		}
		
		let fetchData;
		let headers = new Headers({
			"Accept": "application/json",
		});
		
		headers.append("Authorization", `Bearer ${this.sessionToken}`);
		
		if (body) {
			headers.append("Content-Type", "application/json");
			fetchData = {
				headers: headers,
				method: method,
				body: body
			};
		} else {
			fetchData = {
				headers: headers,
				method: method,
			};
		}
		// Return a Promise
		return fetch(`${this.url}${path}`, fetchData);
	}
}
