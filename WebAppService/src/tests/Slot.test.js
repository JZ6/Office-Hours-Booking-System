import React from "react";
import {shallow, mount} from "enzyme";
import moment from "moment";
import Slot from "../components/Slot";

let testProps, mockSubmit, mockClick;
const testNote =
	`My Bonnie lies over the ocean
	My Bonnie lies over the sea
	My Bonnie lies over the ocean
	Oh, bring back my Bonnie to me...`;

beforeEach(() => {
	mockSubmit = jest.fn();
	mockClick = jest.fn();
	testProps = {
		key: 0,
		startTime: moment("2077/01/01 00:00", "YYYY-MM-DD HH:mm"),
		endTime: moment("2077/01/01 00:10", "YYYY-MM-DD HH:mm"),
		utorId: "parkerpeter15",
		note: testNote,
		maxLength: 50,
		onSubmit: mockSubmit,
		onClick: mockClick
	}
});

it("shows time, assignee, and note", () => {;
	const wrapper = shallow(<Slot {...testProps}/>);
	expect(wrapper.text()).toContain("12:00AM - 12:10AM");
	expect(wrapper.find(".text-input").props().value).toEqual("parkerpeter15");
	expect(wrapper.text()).toContain(testNote);
	expect(wrapper.hasClass("slot")).toBe(true);
});

it("calls callbacks", () => {
	const wrapper = mount(<Slot {...testProps}/>);
	expect(mockSubmit).toHaveBeenCalledTimes(0);
	wrapper.find("form").simulate("submit");
	expect(mockSubmit).toHaveBeenCalledTimes(1);

	expect(mockClick).toHaveBeenCalledTimes(0);
	wrapper.simulate("click");
	expect(mockClick).toHaveBeenCalledTimes(1);
});
