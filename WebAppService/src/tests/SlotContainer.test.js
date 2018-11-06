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
		"12:50AM - 1:00AM"
	]
	
	for (let i = 0; i < testSlots.length; i ++) {
		let elem = wrapper.find(`#slot${i}`);
		expect(elem.text()).toContain(times[i]);
		expect(elem.find(`#utorId${i}`).props().value).toEqual(`student${i}`);
		expect(elem.text()).toContain(`note${i}`);
	}
});

it("edits utorId and clears note", () => {;
	const wrapper = mount(<SlotContainer {...testProps}/>);
	for (let i = 0; i < testSlots.length; i ++) {
		let input = wrapper.find(`#utorId${i}`);
		input.instance().value = `changedName${i}`;
		input.simulate("change");
		expect(wrapper.state()[`utorId${i}`]).toBe(`changedName${i}`);
		expect(wrapper.state()[`note${i}`]).toBe("");
	}
});

it("updates slots", () => {;
	const wrapper = shallow(<SlotContainer {...testProps}/>);
	let times = [
		"12:00AM - 12:10AM",
		"12:10AM - 12:20AM",
		"12:20AM - 12:30AM"
	]
	
	let newSlots = [];
	for (let i = 0; i < 3; i ++) {
		newSlots.push({utorId: `newStudent${i}`, note: `newNote${i}`});
	}
	wrapper.instance().update(newSlots);
	for (let i = 0; i < newSlots.length; i ++) {
		let elem = wrapper.find(`#slot${i}`);
		expect(elem.text()).toContain(times[i]);
		wrapper.update();
		expect(elem.find(`#utorId${i}`).props().value).toEqual(`newStudent${i}`);
		expect(elem.text()).toContain(`newNote${i}`);
	}
});
