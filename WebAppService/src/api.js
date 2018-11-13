export default class Api {
	constructor(url) {
		this.url = url;
		this.sessionToken;
		this.user;
	}
	
	authorize(username, password) {
		// Special call bypassing sessionToken.
		let fetchData = {
			headers = new Headers({
				"Accept": "application/json",
				"Authorization": `Basic ${username}:${password}`.toString("base64")
			}),
			method = "GET"
		};
		this.sessionToken = this.__callFetch(`${this.url}/auth`, fetchData).sessionToken;
		this.__call("GET", `/identity/${username}`);
	}
	
	getBlockIds(startDate, endDate) {
		return this.__call("GET", `/block?from=${startDate}&to={endDate}`).blocks;
	}
	getBlock(blockId) {
		return this.__call("GET", `/blocks/${blockId}`).block;
	}
	addBlock(block) {
		let body = {
			owners: block.owners,
			courseCodes: block.courseCodes,
			comment: block.comment,
			startTime: block.startTime,
			appointmentDuration: block.appointmentDuration
		};
		this.__call("POST", "/block", body);
	}
	editBlock(blockId, block) {
		let body = {
			owners: block.owners,
			courseCodes: block.courseCodes,
			comment: block.comment,
			startTime: block.startTime,
			appointmentDuration: block.appointmentDuration
		};
		this.__call("POST", `/blocks/${blockId}`, body);
	}
	deleteBlock(blockId) {
		this.__call("DELETE", `/blocks/${blockId}`);
	}
	
	getSlots(blockId) {
		return this.__call("GET", `/blocks/${blockId}`).block.appointmentSlots;
	}
	editSlot(blockId, slotId, slot) {
		let body {
			startTime: slotId,
			identity: slot.identity,
			note: slot.note
		}
		this.__call("POST", `/blocks/${blockId}/booking`, body);
	}
	
	__call(method, path, body) {
		
		if (!this.sessionToken) {
			throw new UnauthorizedError("Please login first.");
		}
		
		let fetchData;
		let headers = new Headers({
			"Accept": "application/json",
		});
		
		headers.append("Authorization", `Bearer ${this.sessionToken}`);
		
		if (body) {
			headers.append(
				"Content-Type", 
				"application/json",
			};
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
		this.__callFetch(`${this.url}${path}`, fetchData);
	}
}

__callFetch(url, fetchData) {
	fetch(url, fetchData)
	.then((response) => {
		switch(response.status) {
			case "200":
				console.log("Success:", response);
				return response.json();
			case "401":
				console.log("Failure:", response);
				throw new Error(response.statusText);
			case "409":
				console.log("Failure:", response);
				throw new Error(response.statusText);
			default:
				console.log("Failure:", response);
				throw new Error(response.statusText);
		}
	})
	.catch((error) => {
		throw new Error(error);
	})
}
