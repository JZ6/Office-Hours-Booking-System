import React from "react";
import {shallow, mount} from "enzyme";
import moment from "moment";
import SlotContainer from "../components/SlotContainer";

let testProps, testSlots, mockChange, mockSubmit, mockClick;
const testNote =
	`My Bonnie lies over the ocean
	My Bonnie lies over the sea
	My Bonnie lies over the ocean
	Oh, bring back my Bonnie to me...`;

beforeEach(() => {
	mockChange = jest.fn();
	mockSubmit = jest.fn();
	mockClick = jest.fn();
	
	testSlots = [];
	for (let i = 0; i < 6; i ++) {
		testSlots.push({utorId: `student${i}`, note: `note${i}`});
	}
	
	testProps = {
		slots: testSlots,
		startTime: moment("2077/01/01 00:00", "YYYY-MM-DD HH:mm"),
		slotDuration: 600000,
	}
});

it("shows slots with utorId and note", () => {;
	const wrapper = mount(<SlotContainer {...testProps}/>);
	let times = [
		"12:00AM - 12:10AM",
		"12:10AM - 12:20AM",
		"12:20AM - 12:30AM",
		"12:30AM - 12:40AM",
		"12:40AM - 12:50AM",
		"12:50AM - 1:00AM",
	]
	
	for (let i = 0; i < testSlots.length; i ++) {
		expect(wrapper.find(".slot-container").childAt(i).text()).toContain(times[i]);
		expect(wrapper.find(".slot-container").childAt(i).find(".text-input").props().value).toContain(`student${i}`);
		expect(wrapper.find(".slot-container").childAt(i).text()).toContain(`note${i}`);
	}
});

it("edits utorId and clears note", () => {;
	const wrapper = mount(<SlotContainer {...testProps}/>);
	for (let i = 0; i < testSlots.length; i ++) {
		let input = wrapper.find(".slot-container").childAt(i).find(".text-input")
		input.instance().value = `changedName${i}`;
		input.simulate("change");
		console.log(wrapper.state());
		console.log(wrapper.html())
		expect(wrapper.state()[`utorId${i}`]).toBe(`changedName${i}`);
		expect(wrapper.state()[`note${i}`].note).toBe("");
		break;
	}
	
});
