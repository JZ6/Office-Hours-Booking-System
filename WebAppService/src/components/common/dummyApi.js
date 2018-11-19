export default class DummyApi {
	constructor(url) {
		this.url = url;
		this.sessionToken = null;
		this.delay = 500;
	}

	login(username, password) {
		const jsonPromise = new Promise((resolve, reject) => {
			resolve({sessionToken: "dummysessiontoken"});
		});
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK",
				json: jsonPromise
			}), this.delay);
		});
		return promise;
	}

	getIdentity(id) {
		const jsonPromise = new Promise((resolve, reject) => {
			if (id === "rossbob2") {
				resolve({
					"id": "rossbob2",
					"studentNumber": 1234567890,
					"firstName": "Bob",
					"lastName": "Ross",
					"role": "instructor",
					"courses": [
						"csc300",
						"csc301",
						"csc302"
					]
				});
			} else if (id === "parkerpeter15") {
				resolve({
					"id": "parkerpeter15",
					"studentNumber": 1111222333,
					"firstName": "Peter",
					"lastName": "Parker",
					"role": "student",
					"courses": [
						"csc301",
						"csc302"
					]
				});
			} else if (id === "watsonmj25") {
				resolve({
					"id": "watsonmj25",
					"studentNumber": 1111222333,
					"firstName": "Mary Jane",
					"lastName": "Watson",
					"role": "student",
					"courses": [
						"csc300",
						"csc302"
					]
				});
			} else {
				resolve({});
			}
		});
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK",
				json: jsonPromise
			}), this.delay);
		});
		
		return promise;
	}
	postIdentity(identity) {
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK"
			}), this.delay);
		});
		return promise;
	}
	deleteIdentity(id) {
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK"
			}), this.delay);
		});
		return promise;
	}

	getCourse(courseCode) {
		const jsonPromise = new Promise((resolve, reject) => {
			if (courseCode === "csc300") {
				resolve({
					"instructors": [
						"rossbob2",
						"billalexander5"
					],
					"tas": [
						"atat4",
						"atst2"
					],
					"students": [
						"watsonmj25"
					]
				});
			} else if (courseCode === "csc301") {
				resolve({
					"instructors": [
						"rossbob2",
						"billalexander5"
					],
					"tas": [
						"atat4",
						"atst2"
					],
					"students": [
						"parkerpeter15",
					]
				});
			} else if (courseCode === "csc302") {
				resolve({
					"instructors": [
						"rossbob2"
					],
					"tas": [
						"atat4",
						"atst2"
					],
					"students": [
						"parkerpeter15",
						"watsonmj25"
					]
				});
			}
		});
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK",
				json: jsonPromise
			}), this.delay);
		});
		return promise;
	}
	postCourse(courseCode, course) {
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK"
			}), this.delay);
		});
		return promise;
	}
	deleteCourse(courseCode) {
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK"
			}), this.delay);
		});
		return promise;
	}

	getBlocks(startDate, endDate) {
		const jsonPromise = new Promise((resolve, reject) => {
			resolve(
				{
					"blocks": [
						{
							"blockId": "blockid0",
							"owners": [
								"rossbob2",
								"atat4"
							],
							"courseCodes": [
								"csc301",
								"csc302"
							],
							"comment": "We don't make mistakes, just happy little accidents.",
							"startTime": "2018-11-18T12:00:00",
							"appointmentDuration": 300000,
							"appointmentSlots": [
								{
									"identity": "parkerpeter15",
									"courseCode": "csc302",
									"note": "Everybody gets one."
								},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""}
							]
						},
						{
							"blockId": "blockid1",
							"owners": [
								"rossbob2",
								"atst2"
							],
							"courseCodes": [
								"csc301",
								"csc302"
							],
							"comment": "Birds!",
							"startTime": "2018-11-18T16:00:00",
							"appointmentDuration": 600000,
							"appointmentSlots": [
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""},
								{"identity": "", "courseCode": "", "note": ""}
							]
						}
					]
				}
			);
		});
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK",
				json: jsonPromise
			}), this.delay);
		});
		return promise;
	}
	// Also use for getting slots en masse
	getBlock(blockId) {
		const jsonPromise = new Promise((resolve, reject) => {
			if (blockId === "blockid0") {
				resolve(
					{
						"blockId": "blockid0",
						"owners": [
							"rossbob2",
							"atat4"
						],
						"courseCodes": [
							"csc301",
							"csc302"
						],
						"comment": "We don't make mistakes, just happy little accidents.",
						"startTime": "2018-11-18T12:00:00",
						"appointmentDuration": 300000,
						"appointmentSlots": [
							{
								"identity": "parkerpeter15",
								"courseCode": "csc302",
								"note": "Everybody gets one."
							},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""}
						]
					}
				);
			} else if (blockId === "blockid1") {
				resolve(
					{
						"blockId": "blockid1",
						"owners": [
							"rossbob2",
							"atst2"
						],
						"courseCodes": [
							"csc301",
							"csc302"
						],
						"comment": "Birds!",
						"startTime": "2018-11-18T16:00:00",
						"appointmentDuration": 600000,
						"appointmentSlots": [
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""},
							{"identity": "", "courseCode": "", "note": ""}
						]
					}
				);
			} else {
				resolve({});
			}
		});
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK",
				json: jsonPromise
			}), this.delay);
		});
		return promise;
	}

	postBlock(block) {
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK"
			}), this.delay);
		});
		return promise;
	}

	deleteBlock(blockId) {
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK"
			}), this.delay);
		});
		return promise;
	}

	editSlot(blockId, slotId, slot) {
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK"
			}), this.delay);
		});
		return promise;
	}
	// Edit slots en masse without editing block
	editSlots(blockId, slots) {
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK"
			}), this.delay);
		});
		return promise;
	}
}
