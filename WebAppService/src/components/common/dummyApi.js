import moment from "moment";

export default class DummyApi {
	constructor(url) {
		this.url = url;
		this.sessionToken = null;
		this.delay = 50;
		this.currentBlockId = 2;
		this.currentBlocks = {
			"blocks": [
				{
					"blockId": "0",
					"owners": [
						"rossbob2",
						"atat4"
					],
					"courseCodes": [
						"csc301",
						"csc302"
					],
					"comment": "We don't make mistakes, just happy little accidents.",
					"startTime": "2018-12-03T12:00:00",
					"appointmentDuration": 300000,
					"appointmentSlots": [
						{
							"identity": "parkerpeter15",
							"courseCode": "csc302",
							"note": "Everybody gets one."
						},
						{ "identity": "watsonmj25", "courseCode": "csc301", "note": "Tigers!" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" }
					]
				},
				{
					"blockId": "1",
					"owners": [
						"rossbob2",
						"atst2"
					],
					"courseCodes": [
						"csc301",
						"csc302"
					],
					"comment": "Birds!",
					"startTime": "2018-12-02T16:00:00",
					"appointmentDuration": 600000,
					"appointmentSlots": [
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" }
					]
				},
				{
					"blockId": "2",
					"owners": [
						"rossbob3",
						"atst3"
					],
					"courseCodes": [
						"csc402"
					],
					"comment": "TEST3!",
					"startTime": "2018-12-05T09:00:00",
					"appointmentDuration": 1200000,
					"appointmentSlots": [
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" },
						{ "identity": "", "courseCode": "", "note": "" }
					]
				}
			]
		}
	
		// this.testDummyApi();
	}

	testDummyApi() {
		this.postBlock({
			"blockId": "0",
			"owners": [
				"right",
				"htm"
			],
			"courseCodes": [
				"Test",
				"postblock"
			],
			"comment": "We don't make mistakes, just happy little accidents.",
			"startTime": "2018-11-23T12:00:00",
			"appointmentDuration": 600000,
			"appointmentSlots": [
				{
					"identity": "parkerpeter15",
					"courseCode": "csc302",
					"note": "Everybody gets one."
				},
				{ "identity": "", "courseCode": "", "note": "" },
				{ "identity": "", "courseCode": "", "note": "" },
				{ "identity": "", "courseCode": "", "note": "" },
				{ "identity": "", "courseCode": "", "note": "" },
				{ "identity": "", "courseCode": "", "note": "" },
				{ "identity": "", "courseCode": "", "note": "" },
				{ "identity": "", "courseCode": "", "note": "" },
				{ "identity": "", "courseCode": "", "note": "" },
				{ "identity": "", "courseCode": "", "note": "" },
				{ "identity": "", "courseCode": "", "note": "" }
			]
		},)

		// this.getBlock('blockid0').then(
		// 	result => {

		// 		const {
		// 			status,
		// 			statusText,
		// 			json: jsonPromise
		// 		} = result

		// 		if (status !== 200 || statusText !== "OK") { return false };

		// 		jsonPromise.then(
		// 			result => {
		// 				console.log(result)
		// 			}
		// 		)
		// 	}
		// );

		// console.log(this.currentBlocks.blocks)
		// this.deleteBlock('blockid0');
		
		// console.log(this.currentBlocks.blocks)
	}

	login(username, password) {
		const jsonPromise = () => new Promise((resolve, reject) => {
			resolve({ sessionToken: "dummysessiontoken" });
		});
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK",
				json: jsonPromise
			}), 600);
		});
		return promise;
	}

	getIdentity(id) {
		const jsonPromise = () => new Promise((resolve, reject) => {
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
		const jsonPromise = () => new Promise((resolve, reject) => {
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
		const jsonPromise = () => new Promise((resolve, reject) => {
			resolve(this.currentBlocks);
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

		let foundBlock = this.currentBlocks.blocks.find(element =>
			element.blockId === blockId);

		const jsonPromise = () => new Promise((resolve, reject) => {
			if (!foundBlock) {
				foundBlock = {}
			}
			resolve(foundBlock)
		});
		let promise;
		if (!foundBlock) {
			promise = new Promise((resolve, reject) => {
				setTimeout(() => resolve({
					status: 404,
					statusText: "Block not Found",
				}), this.delay);
			});
		} else {
			promise = new Promise((resolve, reject) => {
				setTimeout(() => resolve({
					status: 200,
					statusText: "OK",
					json: jsonPromise
				}), this.delay);
			});
		}
		
		return promise;
	}

	postBlock(data) {
		let block = this.currentBlocks.blocks.find(element =>
			element.blockId === data.blockId);
		if (block === undefined) {
			// Create default blank block with unique ID
			this.currentBlockId ++;
			block = {
				blockId: this.currentBlockId.toString(),
				owners: "",
				courseCodes: "",
				comment: "",
				startTime: moment().toISOString(),
				appointmentDuration: 0,
				appointmentSlots: []
			}
		} else {
			// Otherwise delete and re-add existing block
			this.currentBlocks.blocks = this.currentBlocks.blocks.filter(
				currentBlock => currentBlock.blockId !== block.blockId)
		}
		
		if (data.owners !== undefined) {
			block.owners = data.owners;
		}
		if (data.courseCodes !== undefined) {
			block.courseCodes = data.courseCodes;
		}
		if (data.comment !== undefined) {
			block.comment = data.comment;
		}
		if (data.startTime !== undefined) {
			block.startTime = data.startTime;
		}
		if (data.appointmentDuration !== undefined) {
			block.appointmentDuration = data.appointmentDuration;
		}
		if (data.appointmentSlots !== undefined) {
			block.appointmentSlots = data.appointmentSlots;
		}
		
		this.currentBlocks.blocks.push(block);
		
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK"
			}), this.delay);
		});
		return promise;
	}

	deleteBlock(blockId) {
		this.currentBlocks.blocks = this.currentBlocks.blocks.filter(
			block => block.blockId !== blockId)

		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK"
			}), this.delay);
		});
		return promise;
	}
	
	editSlot(blockId, slotId, slot) {
		this.currentBlocks.blocks.forEach((b, i) => {
			if (blockId === b.blockId) {
				this.currentBlocks.blocks[i].appointmentSlots[slotId] = slot;
			}
		});
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve({
				status: 200,
				statusText: "OK"
			}), this.delay);
		});
		return promise;
	}
}
