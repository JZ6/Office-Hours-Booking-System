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
		let e = wrapper.find(`#slot${i}`);
		expect(e.text()).toContain(times[i]);
		expect(e.find(`#utorId${i}`).props().value).toEqual(`student${i}`);
		expect(e.find(`#note${i}`).props().value).toEqual(`note${i}`);
	}
});

it("edits utorId and clears note", () => {;
	const wrapper = mount(<SlotContainer {...testProps}/>);
	for (let i = 0; i < testSlots.length; i ++) {
		wrapper.find(`#utorId${i}`).instance().value = `changedName${i}`;
		wrapper.find(`#utorId${i}`).simulate("change");
		
		expect(wrapper.state().slots[i].utorId).toEqual(`changedName${i}`);
		expect(wrapper.state().slots[i].note).toEqual("");
		
		expect(wrapper.find(`#utorId${i}`).props().value).toEqual(`changedName${i}`);
		expect(wrapper.find(`#note${i}`).props().value).toEqual("");
	}
});

it("edits note", () => {;
	const wrapper = mount(<SlotContainer {...testProps}/>);
	for (let i = 0; i < testSlots.length; i ++) {
		let e = wrapper.find(`#slot${i}`);
		e.find(`#note${i}`).instance().value = `changedNote${i}`;
		e.find(`#note${i}`).simulate("change");
		
		expect(wrapper.state().slots[i].note).toEqual(`changedNote${i}`);
		expect(wrapper.find(`#note${i}`).props().value).toEqual(`changedNote${i}`);
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
	wrapper.update();
	for (let i = 0; i < newSlots.length; i ++) {
		let e = wrapper.find(`#slot${i}`);
		expect(e.text()).toContain(times[i]);
		expect(e.find(`#utorId${i}`).props().value).toEqual(`newStudent${i}`);
		expect(e.find(`#note${i}`).props().value).toEqual(`newNote${i}`);
	}
});

it("empties slots", () => {;
	const wrapper = shallow(<SlotContainer {...testProps}/>);
	wrapper.find("#empty-button").simulate("click");
	wrapper.update();
	for (let i = 0; i < testSlots.length; i ++) {
		let e = wrapper.find(`#slot${i}`);
		expect(e.find(`#utorId${i}`).props().value).toEqual("");
		expect(e.find(`#note${i}`).props().value).toEqual("");
	}
});
