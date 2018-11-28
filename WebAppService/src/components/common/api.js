export default class Api {
	constructor(url) {
		this.url = url;
		this.sessionToken = null;
	}

	login(username, password) {
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
			if (typeof (Storage) !== "undefined") {
				sessionStorage.setItem('sessionToken', this.sessionToken);
			}
		});
		return promise;
	}

	getIdentity(id) {
		return this.__call("GET", `/identity/${id}`);
	}
	postIdentity(identity) {
		const body = {
			id: identity.id,
			studentNumber: identity.studentNumber,
			firstName: identity.firstName,
			lastName: identity.lastName,
			role: identity.role,
			courses: identity.courses
		};
		return this.__call("POST", "/identity", body);
	}
	deleteIdentity(id) {
		return this.__call("DELETE", `/identity/${id}`);
	}

	getCourse(courseCode) {
		return this.__call("GET", `/course/${courseCode}`);
	}
	postCourse(courseCode, course) {
		const body = {
			instructors: course.instructors,
			tas: course.tas,
			students: course.students
		};
		return this.__call("POST", `/course/${courseCode}`, body);
	}
	deleteCourse(courseCode) {
		return this.__call("DELETE", `/course/${courseCode}`);
	}

	getBlocks(startDate, endDate) {
		return this.__call("GET", `/blocks?from=${startDate}&to=${endDate}`);
	}
	
	getBlock(blockId) {  // Also use for getting slots en masse
		return this.__call("GET", `/blocks/${blockId}`);
	}

	postBlock(block) {
	
		return this.__call("POST", "/blocks", block);
	}

	deleteBlock(blockId) {
		return this.__call("DELETE", `/blocks/${blockId}`);
	}

	editSlot(blockId, slotId, slot) {
		const body = {
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
			Accept: "application/json",
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
