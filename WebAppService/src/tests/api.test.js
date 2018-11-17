import React from "react";
import ReactDOM from "react-dom";
import Api from "../api";
import {UnauthorizedError} from "../error";

let api;

beforeEach(() => {
	api = new Api("localhost/test");
	global.fetch = jest.fn().mockImplementation(() => {
		return new Promise((resolve, reject) => {
			resolve({
				ok: true, 
				id: "200",
				json: () => {return {sessionToken: "token123"}}
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
			headers: 
				new Headers({
					Accept: "application/json",
					Authorization: "Basic rossbob2:password123".toString("base64")
				}),
			method: "GET"
		}
	);
	
	const response = await request;
	expect(response.ok).toEqual(true);
	expect(response.id).toEqual("200");
	expect(response.json()).toEqual({sessionToken: "token123"});
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
				headers: 
					new Headers({
						Accept: "application/json",
						Authorization: "Bearer token123"
					}),
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
				headers: 
					new Headers({
						Accept: "application/json",
						Authorization: "Bearer token123",
						"Content-Type": "application/json"
					}),
				method: "POST",
				body: body
			}
		);
	});

	test("deleteIdentity", () => {
		api.deleteIdentity("rossbob2");
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/identity/rossbob2", {
				headers: 
					new Headers({
						Accept: "application/json",
						Authorization: "Bearer token123"
					}),
				method: "DELETE"
			}
		);
	});
	
	test("getCourse", () => {
		api.getCourse("csc302");
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/course/csc302", {
				headers: 
					new Headers({
						Accept: "application/json",
						Authorization: "Bearer token123"
					}),
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
				headers: 
					new Headers({
						Accept: "application/json",
						Authorization: "Bearer token123",
						"Content-Type": "application/json"
					}),
				method: "POST",
				body: body
			}
		);
	});
	
	test("deleteCourse", () => {
		api.deleteCourse("csc302");
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/course/csc302", {
				headers: 
					new Headers({
						Accept: "application/json",
						Authorization: "Bearer token123"
					}),
				method: "DELETE"
			}
		);
	});


	test("getBlockIds", () => {
		api.getBlockIds("2008-09-15T15:00:00", "2008-09-15T16:00:00");
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/blocks?from=2008-09-15T15:00:00&to=2008-09-15T16:00:00", {
				headers: 
					new Headers({
						Accept: "application/json",
						Authorization: "Bearer token123"
					}),
				method: "GET"
			}
		);
	});

	test("getBlock", () => {
		api.getBlock("someBlockId");
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/blocks/someBlockId", {
				headers: 
					new Headers({
						Accept: "application/json",
						Authorization: "Bearer token123"
					}),
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
				headers: 
					new Headers({
						Accept: "application/json",
						Authorization: "Bearer token123",
						"Content-Type": "application/json"
					}),
				method: "POST",
				body: body
			}
		);
	});

	test("deleteBlock", () => {
		api.deleteBlock("someBlockId");
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/blocks/someBlockId", {
				headers: 
					new Headers({
						Accept: "application/json",
						Authorization: "Bearer token123"
					}),
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
				headers: 
					new Headers({
						Accept: "application/json",
						Authorization: "Bearer token123",
						"Content-Type": "application/json"
					}),
				method: "POST",
				body: body
			}
		);
	});

	test("editSlots", () => {
		const body = {
			appointmentSlots: [{identity: "", courseCode: "", note: ""}]
		};
		api.editSlots("someBlockId", body);
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledWith(
			"localhost/test/blocks/someBlockId", {
				headers: 
					new Headers({
						Accept: "application/json",
						Authorization: "Bearer token123",
						"Content-Type": "application/json"
					}),
				method: "POST",
				body: body
			}
		);
	});
});




