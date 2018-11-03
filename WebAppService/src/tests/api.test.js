import React from "react";
import ReactDOM from "react-dom";
import Api from "../api";
import {UnauthorizedError} from "../error";

it("initializes with URL", () => {
	const api = new Api("www.dummy.com/url/");
  expect(api.url).toBe("www.dummy.com/url/");
	expect(api.session_token).toBe("");
});

it("sets session token", () => {
	const api = new Api("");
	api.setSessionToken("dummySessionToken123");
	expect(api.session_token).toBe("dummySessionToken123");
	api.setSessionToken("");
	expect(api.session_token).toBe("");
});

it("throws Error during unauthorized API call", () => {
	const api = new Api("www.dummy.com/url/");
	api.setSessionToken("");
	function unauthorizedCall () {
		api.call("blocks", "POST");
	}
	expect(unauthorizedCall).toThrowError(UnauthorizedError);
	expect(unauthorizedCall).toThrowError("Unauthorized POST to www.dummy.com/url/blocks.");
});

it("allows auth call without authorization", () => {
	const api = new Api("");
	api.setSessionToken("");
	api.call("auth", "POST");
});