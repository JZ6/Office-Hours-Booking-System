import React from "react";
import ReactDOM from "react-dom";
import Api from "../api";
import {UnauthorizedError} from "../error";

it("initializes with URL", () => {
	const api = new Api("www.dummy.com/url/");
  expect(api.url).toBe("www.dummy.com/url/");
	expect(api.session_token).toBe("");
});

it("throws Error during unauthorized API call", () => {
	const api = new Api("www.dummy.com/url/");
	function unauthorizedCall () {
		api.call("blocks", "POST");
	}
	expect(unauthorizedCall).toThrowError(UnauthorizedError);
	expect(unauthorizedCall).toThrowError("Unauthorized POST to www.dummy.com/url/blocks.");
});

it("POSTs to auth and sets session token", () => {
	const api = new Api("");
	expect(api.session_token).toBe("");
	const sessionToken = api.call("auth", "POST").sessionToken;
	expect(sessionToken).not.toBe("");
	expect(api.session_token).toBe(sessionToken);
});