import React from "react";
import ReactDOM from "react-dom";
import Api from "../api";
import {UnauthorizedError} from "../error";

it("initializes with URL", () => {
	const api = new Api("localhost/");
  expect(api.url).toBe("localhost/");
	expect(api.sessionToken).toBe("");
});

it("throws Error during unauthorized API call", () => {
	const api = new Api("localhost/");
	function unauthorizedCall () {
		api.call("blocks", "POST");
	}
	expect(unauthorizedCall).toThrowError(UnauthorizedError);
	expect(unauthorizedCall).toThrowError("Unauthorized POST to localhost/blocks.");
});

it("POSTs to auth and sets session token", () => {
	const api = new Api("localhost/");
	expect(api.sessionToken).toBe("");
	const sessionToken = api.call("auth", "POST").sessionToken;
	expect(sessionToken).not.toBe("");
	expect(api.sessionToken).toBe(sessionToken);
});