import React from "react";
import {shallow, mount} from "enzyme";
import moment from "moment";
import Slot from "../components/Slot";

let wrapper, mockChange, mockSubmit, mockClick;
const testNote =
	`My Bonnie lies over the ocean
	My Bonnie lies over the sea
	My Bonnie lies over the ocean
	Oh, bring back my Bonnie to me...`;

beforeEach(() => {
	mockChange = jest.fn();
	mockSubmit = jest.fn();
	mockClick = jest.fn();
	wrapper = shallow(
		<Slot
			key={0}
			startTime={moment("2077/01/01 00:00", "YYYY-MM-DD HH:mm")}
			endTime={moment("2077/01/01 00:10", "YYYY-MM-DD HH:mm")}
			utorId={"parkerpeter15"}
			note={testNote}
			maxLength={50}
			onChange={mockChange}
			onSubmit={mockSubmit}
			onClick={mockClick}
		/>
	);
});

it("shows time, assignee, and note", () => {;
	expect(wrapper.text()).toContain("12:00AM - 12:10AM");
	expect(wrapper.find("input").find({type:"text"}).props().value).toContain("parkerpeter15");
	expect(wrapper.text()).toContain(testNote);
});

it("calls callbacks", () => {
	expect(mockChange).toHaveBeenCalledTimes(0);
	wrapper.find("input").find({type:"text"}).simulate("change");
	expect(mockChange).toHaveBeenCalledTimes(1);
	
	expect(mockSubmit).toHaveBeenCalledTimes(0);
	wrapper.find("form").simulate("submit", { preventDefault () {} });
	expect(mockSubmit).toHaveBeenCalledTimes(1);

	expect(mockClick).toHaveBeenCalledTimes(0);
	wrapper.simulate("click");
	expect(mockClick).toHaveBeenCalledTimes(1);
});
