import React from "react";
import {shallow} from "enzyme";
import moment from "moment";
import Slot from "../components/Slot";

let wrapper, mockCallback;
const testString = 
	`My Bonnie lies over the ocean
	My Bonnie lies over the sea
	My Bonnie lies over the ocean
	Oh, bring back my Bonnie to me...`;
beforeEach(() => {
	mockCallback = jest.fn()
  wrapper = shallow(
		<Slot 
			maxLength={100}
			assignee={"parkerpeter15"}
			note={testString}
			isStudent={true}
			startTime={moment("2077/01/01 00:00", "YYYY-MM-DD HH:mm")}
			endTime={moment("2077/01/01 15:30", "YYYY-MM-DD HH:mm")}
			apiCallback={mockCallback}
		/>
	);
});

it("shows time, assignee, and note", () => {;
	expect(wrapper.text()).toContain("12:00AM - 3:30PM");
	expect(wrapper.find("input").props().value).toContain("parkerpeter15");
	expect(wrapper.text()).toContain(testString);
});

it("edits assignee", () => {
	wrapper.setProps({isStudent: false});
	wrapper.find("input").simulate("change", "watsonmj25");
	expect(wrapper.state().assignee).toEqual("watsonmj25");
});

it("validates assignee length", () => {
	const shortString = "a".repeat(100);
	const longString = "1".repeat(101);
	
	// Test warning messages
	wrapper.find("input").simulate("change", shortString);
	expect(wrapper.text()).not.toContain("UtorID exceeds 100 characters.");
	wrapper.find("input").simulate("change", longString);
	expect(wrapper.text()).toContain("UtorID exceeds 100 characters.");
	
	// Test submission denial
	wrapper.find("form").simulate("submit", { preventDefault () {} });
	expect(mockCallback).toHaveBeenCalledTimes(0);
});

it("edits value", () => {
	const testString = 
		`My Bonnie lies over the ocean
		My Bonnie lies over the sea
		My Bonnie lies over the ocean
		Oh, bring back my Bonnie to me...`;
	
	wrapper.find("textarea").simulate("change", testString);
	expect(wrapper.state().value).toEqual(testString);
});

it("submits value", () => {
	const testString = 
		`My Bonnie lies over the ocean
		My Bonnie lies over the sea
		My Bonnie lies over the ocean
		Oh, bring back my Bonnie to me...`;
	
	wrapper.find("textarea").simulate("change", testString);
	expect(wrapper.state().value).toEqual(testString);
	
	wrapper.find("form").simulate("submit", { preventDefault () {} });
	expect(mockCallback).toHaveBeenCalledTimes(1);
	expect(mockCallback).toHaveBeenCalledWith({value: testString, warning: ""});
});