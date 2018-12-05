export default class Api {
	constructor(url) {
		this.url = url;
		this.sessionToken = null;
	}

	login(username, password) {
		// Special call bypassing sessionToken.
		let fetchData = {
			headers: {
				"Accept": "application/json",
				"Authorization": `Basic ${username}:${password}`.toString("base64"),
				"Access-Control-Allow-Origin": `${this.url}`,
			},
			method: "GET"
		};
		console.log("Request:", `${this.url}/auth`, fetchData);
		let promise = fetch(`${this.url}/auth`, fetchData);
		promise.then((response) => {
			console.log("Response:", response);
			if (response.status !== 200) {
				window.alert(`${response.status}: ${response.statusText}`);
			}
			response.json().then((data) => {
				this.sessionToken = data.token;
			});
			if (typeof (Storage) !== "undefined") {
				sessionStorage.setItem("sessionToken", this.sessionToken);
			}
		})
		.catch((error) => {
			console.log(error);
			window.alert(error.message);
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
		return this.__call("POST", "/identity", JSON.stringify(body));
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
		return this.__call("POST", `/course/${courseCode}`, JSON.stringify(body));
	}
	deleteCourse(courseCode) {
		return this.__call("DELETE", `/course/${courseCode}`);
	}

	getBlocks(startDate, endDate) {
		return this.__call("GET", `/blocks`);
	}
	
	getBlock(blockId) {  // Also use for getting slots en masse
		return this.__call("GET", `/blocks/${blockId}`);
	}

	postBlock(block) {
		return this.__call("POST", "/blocks", JSON.stringify(block));
	}

	deleteBlock(blockId) {
		return this.__call("DELETE", `/blocks/${blockId}`);
	}

	editSlot(blockId, slotId, slot) {
		const body = {
			startTime: slotId,
			identity: slot.identity,
			courseCode: slot.courseCode,
			note: slot.note
		}
		return this.__call("POST", `/blocks/${blockId}/booking`, JSON.stringify(body));
	}

	__call(method, path, body) {

		if (!this.sessionToken) {
			throw new Error("Please login first.");
		}

		let fetchData;
		let headers = {
			"Accept": "application/json",
			"Authorization": `Bearer ${this.sessionToken}`,
			"Access-Control-Allow-Origin": `${this.url}`
		};

		if (body) {
			headers["Content-Type"] = "application/json";
			fetchData = {
				headers: headers,
				method: method,
				body: body
			};
		} else {
			fetchData = {
				headers: headers,
				method: method
			};
		}
		console.log("Request:", `${this.url}${path}`, fetchData);
		
		// Return a Promise
		return fetch(`${this.url}${path}`, fetchData);
	}
}
