import React from "react";
import ReactDOM from "react-dom";
import Api from "../components/common/api";
import {UnauthorizedError} from '../components/common/error';

let api, jsonPromise;

beforeEach(() => {
	api = new Api("localhost/test");
	jsonPromise = new Promise((resolve, reject) => {
		resolve({token: "token123"});
	});
	global.fetch = jest.fn().mockImplementation(() => {
		return new Promise((resolve, reject) => {
			resolve({
				ok: true, 
				id: "200",
				json: () => jsonPromise
			});
		});
	});
});

test("login", async () => {
	// Test not logged in.
	expect(() => api.getIdentity("rossbob2")).toThrowError("Please login first.");
	
	const request = api.login("rossbob2", "password123");
	expect(fetch).toHaveBeenCalledTimes(1);
	expect(fetch).toHaveBeenCalledWith(
		"localhost/test/auth", {
			headers: {
				Accept: "application/json",
				Authorization: "Basic rossbob2:password123".toString("base64"),
				"Access-Control-Allow-Origin": "localhost/test"
			},
			method: "GET"
		}
	);
	
	const response = await request;
	const data = await jsonPromise;
	
	expect(response.ok).toEqual(true);
	expect(response.id).toEqual("200");
	expect(data).toEqual({token: "token123"});
	expect(api.sessionToken).toEqual("token123");
});

describe("Logged in", () => {
	beforeEach(async () => {
		await api.login("rossbob2", "password123");
	});
	
	test("getIdentity", () => {
		api.getIdentity("rossbob2");
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/identity/rossbob2", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer token123",
					"Access-Control-Allow-Origin": "localhost/test"
				},
				method: "GET"
			}
		);
	});
	
	test("postIdentity", () => {
		const body = {
			id: "rossbob2",
			studentNumber: "0123456789",
			firstName: "Bob",
			lastName: "Ross",
			role: "instructor",
			courses: ["csc300", "csc301", "csc302"]
		}
		api.postIdentity(body);
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/identity", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer token123",
					"Access-Control-Allow-Origin": "localhost/test",
					"Content-Type": "application/json"
				},
				method: "POST",
				body: JSON.stringify(body)
			}
		);
	});

	test("deleteIdentity", () => {
		api.deleteIdentity("rossbob2");
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/identity/rossbob2", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer token123",
					"Access-Control-Allow-Origin": "localhost/test"
				},
				method: "DELETE"
			}
		);
	});
	
	test("getCourse", () => {
		api.getCourse("csc302");
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/course/csc302", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer token123",
					"Access-Control-Allow-Origin": "localhost/test"
				},
				method: "GET"
			}
		);
	});
	
	test("postCourse", () => {
		let body = {
			instructors: ["rossbob2"],
			tas: ["atat2"],
			students: ["parkerpeter15"]
		}
		api.postCourse("csc302", body);
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/course/csc302", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer token123",
					"Access-Control-Allow-Origin": "localhost/test",
					"Content-Type": "application/json"
				},
				method: "POST",
				body: JSON.stringify(body)
			}
		);
	});
	
	test("deleteCourse", () => {
		api.deleteCourse("csc302");
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/course/csc302", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer token123",
					"Access-Control-Allow-Origin": "localhost/test"
				},
				method: "DELETE"
			}
		);
	});


	test("getBlocks", () => {
		api.getBlocks("2008-09-15T15:00:00", "2008-09-15T16:00:00");
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/blocks", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer token123",
					"Access-Control-Allow-Origin": "localhost/test"
				},
				method: "GET"
			}
		);
	});

	test("getBlock", () => {
		api.getBlock("someBlockId");
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/blocks/someBlockId", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer token123",
					"Access-Control-Allow-Origin": "localhost/test"
				},
				method: "GET"
			}
		);
	});

	test("postBlock", () => {
		const body = {
			blockId: "someBlockId",
			owners: ["rossbob2"],
			courseCodes: ["csc302"],
			comment: "Happy little accidents!",
			startTime: "2008-09-15T15:00:00",
			appointmentDuration: 3600000,
			appointmentSlots: [{identity: "", courseCode: "", note: ""}]
		};
		api.postBlock(body);
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/blocks", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer token123",
					"Access-Control-Allow-Origin": "localhost/test",
					"Content-Type": "application/json"
				},
				method: "POST",
				body: JSON.stringify(body)
			}
		);
	});

	test("deleteBlock", () => {
		api.deleteBlock("someBlockId");
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/blocks/someBlockId", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer token123",
					"Access-Control-Allow-Origin": "localhost/test"
				},
				method: "DELETE"
			}
		);
	});

	test("editSlot", () => {
		let body = {
			identity: "parkerpeter15", 
			note: "It's spelled Spider-Man."
		}
		api.editSlot("someBlockId", 4, body);
		body = {
			startTime: 4,
			identity: "parkerpeter15", 
			note: "It's spelled Spider-Man."
		}
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/blocks/someBlockId/booking", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer token123",
					"Access-Control-Allow-Origin": "localhost/test",
					"Content-Type": "application/json"
				},
				method: "POST",
				body: JSON.stringify(body)
			}
		);
	});
});




